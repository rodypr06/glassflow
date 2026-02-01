import { dbGet, dbAll, dbRun } from '../config/database.js';

class Setting {
  // Find all settings for a user
  static async findAll(userId) {
    const sql = 'SELECT * FROM settings WHERE user_id = ?';
    const settings = await dbGet(sql, [userId]);
    return settings || this.getDefaultSettings();
  }

  // Find setting by ID (with user filtering)
  static async findById(id, userId) {
    const sql = 'SELECT * FROM settings WHERE id = ? AND user_id = ?';
    return await dbGet(sql, [id, userId]);
  }

  // Get default settings
  static getDefaultSettings() {
    return {
      theme: 'dark',
      accent_color: '#6366f1',
      notifications_enabled: true
    };
  }

  // Create new settings
  static async create(data) {
    const { user_id, theme, accent_color, notifications_enabled } = data;
    const sql = `
      INSERT INTO settings (user_id, theme, accent_color, notifications_enabled)
      VALUES (?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [user_id, theme, accent_color, notifications_enabled ? 1 : 0]);
    return await this.findById(result.id, user_id);
  }

  // Update settings
  static async update(userId, data) {
    const { theme, accent_color, notifications_enabled } = data;
    const sql = `
      UPDATE settings
      SET theme = ?, accent_color = ?, notifications_enabled = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;
    const result = await dbRun(sql, [theme, accent_color, notifications_enabled ? 1 : 0, userId]);
    if (result.changes === 0) {
      // Settings don't exist, create them
      return await this.create({ user_id: userId, theme, accent_color, notifications_enabled });
    }
    return await this.findAll(userId);
  }

  // Delete settings
  static async delete(id, userId) {
    const sql = 'DELETE FROM settings WHERE id = ? AND user_id = ?';
    const result = await dbRun(sql, [id, userId]);
    return result.changes > 0;
  }
}

export default Setting;
