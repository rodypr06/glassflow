import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all memberships
router.get('/', async (req, res) => {
  try {
    const memberships = await dbAll(
      'SELECT * FROM memberships WHERE user_id = ? ORDER BY renewal_date ASC',
      [req.userId]
    );
    res.json({ memberships });
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single membership
router.get('/:id', async (req, res) => {
  try {
    const membership = await dbGet(
      'SELECT * FROM memberships WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json({ membership });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create membership
router.post('/', async (req, res) => {
  try {
    const { name, organization, type, cost, renewal_date, status, benefits } = req.body;

    // Validate input
    if (!name || !cost) {
      return res.status(400).json({ error: 'Name and cost are required' });
    }

    if (cost <= 0) {
      return res.status(400).json({ error: 'Cost must be greater than 0' });
    }

    const validStatuses = ['active', 'inactive', 'expired'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await dbRun(
      'INSERT INTO memberships (user_id, name, organization, type, cost, renewal_date, status, benefits) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, name, organization || null, type || null, cost, renewal_date || null, status || 'active', benefits || null]
    );

    const membership = await dbGet(
      'SELECT * FROM memberships WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Membership created successfully',
      membership
    });
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update membership
router.put('/:id', async (req, res) => {
  try {
    const { name, organization, type, cost, renewal_date, status, benefits } = req.body;

    // Validate input
    if (!name && !cost) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    // Check if membership belongs to user
    const existing = await dbGet(
      'SELECT id FROM memberships WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (organization !== undefined) {
      updates.push('organization = ?');
      params.push(organization);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }
    if (cost !== undefined) {
      if (cost <= 0) {
        return res.status(400).json({ error: 'Cost must be greater than 0' });
      }
      updates.push('cost = ?');
      params.push(cost);
    }
    if (renewal_date !== undefined) {
      updates.push('renewal_date = ?');
      params.push(renewal_date);
    }
    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'expired'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updates.push('status = ?');
      params.push(status);
    }
    if (benefits !== undefined) {
      updates.push('benefits = ?');
      params.push(benefits);
    }

    params.push(req.params.id);

    await dbRun(
      `UPDATE memberships SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    const membership = await dbGet(
      'SELECT * FROM memberships WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Membership updated successfully',
      membership
    });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete membership
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM memberships WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Delete membership error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get membership summary
router.get('/summary/total', async (req, res) => {
  try {
    const total = await dbGet(
      'SELECT SUM(cost) as total FROM memberships WHERE user_id = ? AND status = "active"',
      [req.userId]
    );

    res.json({ total: total.total || 0 });
  } catch (error) {
    console.error('Get membership summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
