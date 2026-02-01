import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all bills
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM bills WHERE user_id = ?';
    const params = [req.userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY due_date ASC';

    const bills = await dbAll(query, params);
    res.json({ bills });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single bill
router.get('/:id', async (req, res) => {
  try {
    const bill = await dbGet(
      'SELECT * FROM bills WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ bill });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create bill
router.post('/', async (req, res) => {
  try {
    const { name, category, amount, due_date, status, is_recurring, notes } = req.body;

    // Validate input
    if (!name || !amount || !due_date) {
      return res.status(400).json({ error: 'Name, amount, and due date are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const validStatuses = ['pending', 'paid', 'overdue'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await dbRun(
      'INSERT INTO bills (user_id, name, category, amount, due_date, status, is_recurring, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, name, category || null, amount, due_date, status || 'pending', is_recurring ? 1 : 0, notes || null]
    );

    const bill = await dbGet(
      'SELECT * FROM bills WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Bill created successfully',
      bill
    });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update bill
router.put('/:id', async (req, res) => {
  try {
    const { name, category, amount, due_date, status, is_recurring, notes } = req.body;

    // Validate input
    if (!name && !amount && !due_date && !status) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    // Check if bill belongs to user
    const existing = await dbGet(
      'SELECT id FROM bills WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
      }
      updates.push('amount = ?');
      params.push(amount);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (status !== undefined) {
      const validStatuses = ['pending', 'paid', 'overdue'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updates.push('status = ?');
      params.push(status);
    }
    if (is_recurring !== undefined) {
      updates.push('is_recurring = ?');
      params.push(is_recurring ? 1 : 0);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    params.push(req.params.id);

    await dbRun(
      `UPDATE bills SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    const bill = await dbGet(
      'SELECT * FROM bills WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Bill updated successfully',
      bill
    });
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete bill
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM bills WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Delete bill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upcoming bills
router.get('/upcoming/days/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days) || 7;
    
    const bills = await dbAll(
      `SELECT * FROM bills 
       WHERE user_id = ? 
       AND status != 'paid'
       AND date(due_date) BETWEEN date('now') AND date('now', '+' || ? || ' days')
       ORDER BY due_date ASC`,
      [req.userId, days]
    );

    res.json({ bills });
  } catch (error) {
    console.error('Get upcoming bills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark bill as paid
router.patch('/:id/pay', async (req, res) => {
  try {
    const result = await dbRun(
      'UPDATE bills SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      ['paid', req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const bill = await dbGet(
      'SELECT * FROM bills WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Bill marked as paid',
      bill
    });
  } catch (error) {
    console.error('Mark bill paid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
