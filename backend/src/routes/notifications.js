import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const { unread } = req.query;
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.userId];

    if (unread === 'true') {
      query += ' AND is_read = 0';
    }

    query += ' ORDER BY created_at DESC';

    const notifications = await dbAll(query, params);
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread count
router.get('/unread/count', async (req, res) => {
  try {
    const result = await dbGet(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.userId]
    );

    res.json({ count: result.count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    const { type, title, message, related_id } = req.body;

    // Validate input
    if (!type || !title || !message) {
      return res.status(400).json({ error: 'Type, title, and message are required' });
    }

    const validTypes = ['bill_due', 'bill_paid', 'subscription_renewal', 'loan_payment', 'info', 'warning', 'success'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    const result = await dbRun(
      'INSERT INTO notifications (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)',
      [req.userId, type, title, message, related_id || null]
    );

    const notification = await dbGet(
      'SELECT * FROM notifications WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const result = await dbRun(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const notification = await dbGet(
      'SELECT * FROM notifications WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read
router.patch('/read/all', async (req, res) => {
  try {
    const result = await dbRun(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [req.userId]
    );

    res.json({
      message: `${result.changes} notifications marked as read`,
      count: result.changes
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete all read notifications
router.delete('/read/all', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM notifications WHERE user_id = ? AND is_read = 1',
      [req.userId]
    );

    res.json({
      message: `${result.changes} read notifications deleted`,
      count: result.changes
    });
  } catch (error) {
    console.error('Delete read notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete all notifications
router.delete('/all', async (req, res) => {
  try {
    const result = await dbRun(
      'DELETE FROM notifications WHERE user_id = ?',
      [req.userId]
    );

    res.json({
      message: `${result.changes} notifications deleted`,
      count: result.changes
    });
  } catch (error) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
