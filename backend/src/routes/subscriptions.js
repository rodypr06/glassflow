import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await dbAll(
      'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY renewal_date ASC',
      [req.userId]
    );
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single subscription
router.get('/:id', async (req, res) => {
  try {
    const subscription = await dbGet(
      'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create subscription
router.post('/', async (req, res) => {
  try {
    const { name, category, cost, billing_cycle, renewal_date, notes } = req.body;

    // Validate input
    if (!name || !cost || !billing_cycle) {
      return res.status(400).json({ error: 'Name, cost, and billing cycle are required' });
    }

    if (cost <= 0) {
      return res.status(400).json({ error: 'Cost must be greater than 0' });
    }

    const validCycles = ['monthly', 'yearly', 'weekly', 'quarterly'];
    if (!validCycles.includes(billing_cycle)) {
      return res.status(400).json({ error: 'Invalid billing cycle' });
    }

    const result = await dbRun(
      'INSERT INTO subscriptions (user_id, name, category, cost, billing_cycle, renewal_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, name, category || null, cost, billing_cycle, renewal_date || null, notes || null]
    );

    const subscription = await dbGet(
      'SELECT * FROM subscriptions WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription
router.put('/:id', async (req, res) => {
  try {
    const { name, category, cost, billing_cycle, renewal_date, notes } = req.body;

    // Validate input
    if (!name && !cost && !billing_cycle) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    // Check if subscription belongs to user
    const existing = await dbGet(
      'SELECT id FROM subscriptions WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Subscription not found' });
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
    if (cost !== undefined) {
      if (cost <= 0) {
        return res.status(400).json({ error: 'Cost must be greater than 0' });
      }
      updates.push('cost = ?');
      params.push(cost);
    }
    if (billing_cycle !== undefined) {
      const validCycles = ['monthly', 'yearly', 'weekly', 'quarterly'];
      if (!validCycles.includes(billing_cycle)) {
        return res.status(400).json({ error: 'Invalid billing cycle' });
      }
      updates.push('billing_cycle = ?');
      params.push(billing_cycle);
    }
    if (renewal_date !== undefined) {
      updates.push('renewal_date = ?');
      params.push(renewal_date);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    params.push(req.params.id);

    await dbRun(
      `UPDATE subscriptions SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    const subscription = await dbGet(
      'SELECT * FROM subscriptions WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM subscriptions WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription summary
router.get('/summary/total', async (req, res) => {
  try {
    const monthly = await dbGet(
      'SELECT SUM(CASE WHEN billing_cycle = "monthly" THEN cost WHEN billing_cycle = "yearly" THEN cost / 12 WHEN billing_cycle = "quarterly" THEN cost / 3 WHEN billing_cycle = "weekly" THEN cost * 4 ELSE 0 END) as total FROM subscriptions WHERE user_id = ?',
      [req.userId]
    );

    const yearly = await dbGet(
      'SELECT SUM(CASE WHEN billing_cycle = "yearly" THEN cost WHEN billing_cycle = "monthly" THEN cost * 12 WHEN billing_cycle = "quarterly" THEN cost * 4 WHEN billing_cycle = "weekly" THEN cost * 52 ELSE 0 END) as total FROM subscriptions WHERE user_id = ?',
      [req.userId]
    );

    res.json({
      monthly: monthly.total || 0,
      yearly: yearly.total || 0
    });
  } catch (error) {
    console.error('Get subscription summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
