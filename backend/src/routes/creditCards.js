import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all credit cards
router.get('/', async (req, res) => {
  try {
    const cards = await dbAll(
      'SELECT * FROM credit_cards WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ cards });
  } catch (error) {
    console.error('Get credit cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single credit card
router.get('/:id', async (req, res) => {
  try {
    const card = await dbGet(
      'SELECT * FROM credit_cards WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!card) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    res.json({ card });
  } catch (error) {
    console.error('Get credit card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create credit card
router.post('/', async (req, res) => {
  try {
    const { name, bank, card_type, last_four, balance, credit_limit, due_date, color } = req.body;

    // Validate input
    if (!name || !last_four) {
      return res.status(400).json({ error: 'Name and last four digits are required' });
    }

    if (last_four.length !== 4 || !/^\d{4}$/.test(last_four)) {
      return res.status(400).json({ error: 'Last four digits must be exactly 4 digits' });
    }

    if (balance !== undefined && balance < 0) {
      return res.status(400).json({ error: 'Balance cannot be negative' });
    }

    if (credit_limit !== undefined && credit_limit <= 0) {
      return res.status(400).json({ error: 'Credit limit must be greater than 0' });
    }

    const result = await dbRun(
      'INSERT INTO credit_cards (user_id, name, bank, card_type, last_four, balance, credit_limit, due_date, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, name, bank || null, card_type || null, last_four, balance || 0, credit_limit || null, due_date || null, color || null]
    );

    const card = await dbGet(
      'SELECT * FROM credit_cards WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Credit card created successfully',
      card
    });
  } catch (error) {
    console.error('Create credit card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update credit card
router.put('/:id', async (req, res) => {
  try {
    const { name, bank, card_type, last_four, balance, credit_limit, due_date, color } = req.body;

    // Validate input
    if (!name && !last_four) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    // Check if card belongs to user
    const existing = await dbGet(
      'SELECT id FROM credit_cards WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (bank !== undefined) {
      updates.push('bank = ?');
      params.push(bank);
    }
    if (card_type !== undefined) {
      updates.push('card_type = ?');
      params.push(card_type);
    }
    if (last_four !== undefined) {
      if (last_four.length !== 4 || !/^\d{4}$/.test(last_four)) {
        return res.status(400).json({ error: 'Last four digits must be exactly 4 digits' });
      }
      updates.push('last_four = ?');
      params.push(last_four);
    }
    if (balance !== undefined) {
      if (balance < 0) {
        return res.status(400).json({ error: 'Balance cannot be negative' });
      }
      updates.push('balance = ?');
      params.push(balance);
    }
    if (credit_limit !== undefined) {
      if (credit_limit <= 0) {
        return res.status(400).json({ error: 'Credit limit must be greater than 0' });
      }
      updates.push('credit_limit = ?');
      params.push(credit_limit);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (color !== undefined) {
      updates.push('color = ?');
      params.push(color);
    }

    params.push(req.params.id);

    await dbRun(
      `UPDATE credit_cards SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    const card = await dbGet(
      'SELECT * FROM credit_cards WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Credit card updated successfully',
      card
    });
  } catch (error) {
    console.error('Update credit card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete credit card
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM credit_cards WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    res.json({ message: 'Credit card deleted successfully' });
  } catch (error) {
    console.error('Delete credit card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get credit card summary
router.get('/summary/total', async (req, res) => {
  try {
    const cards = await dbAll(
      'SELECT * FROM credit_cards WHERE user_id = ?',
      [req.userId]
    );

    let totalBalance = 0;
    let totalLimit = 0;

    cards.forEach(card => {
      totalBalance += card.balance;
      if (card.credit_limit) {
        totalLimit += card.credit_limit;
      }
    });

    const utilization = totalLimit > 0 ? (totalBalance / totalLimit * 100) : 0;

    res.json({
      totalBalance,
      totalLimit,
      utilization: Math.round(utilization * 100) / 100,
      cardCount: cards.length
    });
  } catch (error) {
    console.error('Get credit card summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
