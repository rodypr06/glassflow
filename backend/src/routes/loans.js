import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all loans
router.get('/', async (req, res) => {
  try {
    const loans = await dbAll(
      'SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ loans });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single loan
router.get('/:id', async (req, res) => {
  try {
    const loan = await dbGet(
      'SELECT * FROM loans WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get payment history
    const payments = await dbAll(
      'SELECT * FROM loan_payments WHERE loan_id = ? ORDER BY payment_date DESC',
      [req.params.id]
    );

    res.json({ loan, payments });
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create loan
router.post('/', async (req, res) => {
  try {
    const { name, lender, type, original_amount, outstanding_amount, interest_rate, payment_amount, payment_frequency, next_payment_date, status } = req.body;

    // Validate input
    if (!name || !original_amount || !outstanding_amount) {
      return res.status(400).json({ error: 'Name, original amount, and outstanding amount are required' });
    }

    if (original_amount <= 0 || outstanding_amount <= 0) {
      return res.status(400).json({ error: 'Amounts must be greater than 0' });
    }

    if (outstanding_amount > original_amount) {
      return res.status(400).json({ error: 'Outstanding amount cannot exceed original amount' });
    }

    const validStatuses = ['active', 'paid_off', 'deferred'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await dbRun(
      'INSERT INTO loans (user_id, name, lender, type, original_amount, outstanding_amount, interest_rate, payment_amount, payment_frequency, next_payment_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, name, lender || null, type || null, original_amount, outstanding_amount, interest_rate || null, payment_amount || null, payment_frequency || null, next_payment_date || null, status || 'active']
    );

    const loan = await dbGet(
      'SELECT * FROM loans WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Loan created successfully',
      loan
    });
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update loan
router.put('/:id', async (req, res) => {
  try {
    const { name, lender, type, original_amount, outstanding_amount, interest_rate, payment_amount, payment_frequency, next_payment_date, status } = req.body;

    // Validate input
    if (!name && !original_amount && !outstanding_amount) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    // Check if loan belongs to user
    const existing = await dbGet(
      'SELECT id FROM loans WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (lender !== undefined) {
      updates.push('lender = ?');
      params.push(lender);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }
    if (original_amount !== undefined) {
      if (original_amount <= 0) {
        return res.status(400).json({ error: 'Original amount must be greater than 0' });
      }
      updates.push('original_amount = ?');
      params.push(original_amount);
    }
    if (outstanding_amount !== undefined) {
      if (outstanding_amount <= 0) {
        return res.status(400).json({ error: 'Outstanding amount must be greater than 0' });
      }
      updates.push('outstanding_amount = ?');
      params.push(outstanding_amount);
    }
    if (interest_rate !== undefined) {
      updates.push('interest_rate = ?');
      params.push(interest_rate);
    }
    if (payment_amount !== undefined) {
      updates.push('payment_amount = ?');
      params.push(payment_amount);
    }
    if (payment_frequency !== undefined) {
      updates.push('payment_frequency = ?');
      params.push(payment_frequency);
    }
    if (next_payment_date !== undefined) {
      updates.push('next_payment_date = ?');
      params.push(next_payment_date);
    }
    if (status !== undefined) {
      const validStatuses = ['active', 'paid_off', 'deferred'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updates.push('status = ?');
      params.push(status);
    }

    params.push(req.params.id);

    await dbRun(
      `UPDATE loans SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    const loan = await dbGet(
      'SELECT * FROM loans WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Loan updated successfully',
      loan
    });
  } catch (error) {
    console.error('Update loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete loan
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM loans WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add payment to loan
router.post('/:id/payments', async (req, res) => {
  try {
    const { amount, payment_date, notes } = req.body;

    // Validate input
    if (!amount || !payment_date) {
      return res.status(400).json({ error: 'Amount and payment date are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Check if loan belongs to user
    const loan = await dbGet(
      'SELECT id, outstanding_amount FROM loans WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Add payment record
    await dbRun(
      'INSERT INTO loan_payments (loan_id, amount, payment_date, notes) VALUES (?, ?, ?, ?)',
      [req.params.id, amount, payment_date, notes || null]
    );

    // Update outstanding amount
    const newOutstanding = Math.max(0, loan.outstanding_amount - amount);
    const newStatus = newOutstanding === 0 ? 'paid_off' : 'active';

    await dbRun(
      'UPDATE loans SET outstanding_amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newOutstanding, newStatus, req.params.id]
    );

    const updatedLoan = await dbGet(
      'SELECT * FROM loans WHERE id = ?',
      [req.params.id]
    );

    res.status(201).json({
      message: 'Payment recorded successfully',
      loan: updatedLoan,
      paid_off: newOutstanding === 0
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get loan summary
router.get('/summary/total', async (req, res) => {
  try {
    const total = await dbGet(
      'SELECT SUM(outstanding_amount) as total FROM loans WHERE user_id = ? AND status = "active"',
      [req.userId]
    );

    const loans = await dbAll(
      'SELECT * FROM loans WHERE user_id = ? AND status = "active"',
      [req.userId]
    );

    const originalTotal = loans.reduce((sum, loan) => sum + loan.original_amount, 0);

    res.json({
      totalDebt: total.total || 0,
      originalDebt: originalTotal,
      loanCount: loans.length
    });
  } catch (error) {
    console.error('Get loan summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
