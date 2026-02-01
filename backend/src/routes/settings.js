import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user settings
router.get('/', async (req, res) => {
  try {
    let settings = await dbGet(
      'SELECT * FROM settings WHERE user_id = ?',
      [req.userId]
    );

    // Create default settings if not exists
    if (!settings) {
      await dbRun(
        'INSERT INTO settings (user_id) VALUES (?)',
        [req.userId]
      );

      settings = await dbGet(
        'SELECT * FROM settings WHERE user_id = ?',
        [req.userId]
      );
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const { theme, accent_color, notification_enabled, bill_reminder_days, subscription_reminder_days } = req.body;

    // Validate input
    if (theme && !['light', 'dark', 'auto'].includes(theme)) {
      return res.status(400).json({ error: 'Invalid theme' });
    }

    if (accent_color && !/^#[0-9A-Fa-f]{6}$/.test(accent_color)) {
      return res.status(400).json({ error: 'Invalid accent color format (use hex: #RRGGBB)' });
    }

    if (bill_reminder_days !== undefined && (bill_reminder_days < 1 || bill_reminder_days > 30)) {
      return res.status(400).json({ error: 'Bill reminder days must be between 1 and 30' });
    }

    if (subscription_reminder_days !== undefined && (subscription_reminder_days < 1 || subscription_reminder_days > 30)) {
      return res.status(400).json({ error: 'Subscription reminder days must be between 1 and 30' });
    }

    // Check if settings exist
    const existing = await dbGet(
      'SELECT id FROM settings WHERE user_id = ?',
      [req.userId]
    );

    // Build update/insert query
    const updates = [];
    const params = [];

    if (theme !== undefined) {
      updates.push('theme = ?');
      params.push(theme);
    }
    if (accent_color !== undefined) {
      updates.push('accent_color = ?');
      params.push(accent_color);
    }
    if (notification_enabled !== undefined) {
      updates.push('notification_enabled = ?');
      params.push(notification_enabled ? 1 : 0);
    }
    if (bill_reminder_days !== undefined) {
      updates.push('bill_reminder_days = ?');
      params.push(bill_reminder_days);
    }
    if (subscription_reminder_days !== undefined) {
      updates.push('subscription_reminder_days = ?');
      params.push(subscription_reminder_days);
    }

    params.push(req.userId);

    if (existing) {
      await dbRun(
        `UPDATE settings SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        params
      );
    } else {
      const placeholders = updates.map(() => '?').join(', ');
      await dbRun(
        `INSERT INTO settings (user_id, ${updates.map(u => u.split(' = ')[0]).join(', ')}) VALUES (?, ${placeholders})`,
        params
      );
    }

    const settings = await dbGet(
      'SELECT * FROM settings WHERE user_id = ?',
      [req.userId]
    );

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset to default settings
router.post('/reset', async (req, res) => {
  try {
    await dbRun(
      'UPDATE settings SET theme = ?, accent_color = ?, notification_enabled = ?, bill_reminder_days = ?, subscription_reminder_days = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      ['dark', '#6366f1', 1, 7, 3, req.userId]
    );

    const settings = await dbGet(
      'SELECT * FROM settings WHERE user_id = ?',
      [req.userId]
    );

    res.json({
      message: 'Settings reset to defaults',
      settings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
