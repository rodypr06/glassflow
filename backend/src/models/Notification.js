import { dbGet, dbAll, dbRun } from '../config/database.js';

class Notification {
  // Find all notifications for a user
  static async findAll(userId, limit = 50) {
    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    return await dbAll(sql, [userId, limit]);
  }

  // Find notification by ID (with user filtering)
  static async findById(id, userId) {
    const sql = 'SELECT * FROM notifications WHERE id = ? AND user_id = ?';
    return await dbGet(sql, [id, userId]);
  }

  // Create new notification
  static async create(data) {
    const { user_id, title, message, type } = data;
    const sql = `
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [user_id, title, message, type]);
    return await this.findById(result.id, user_id);
  }

  // Mark notification as read
  static async markAsRead(id, userId) {
    const sql = `
      UPDATE notifications
      SET read = 1
      WHERE id = ? AND user_id = ?
    `;
    await dbRun(sql, [id, userId]);
    return await this.findById(id, userId);
  }

  // Mark all notifications as read for user
  static async markAllAsRead(userId) {
    const sql = `
      UPDATE notifications
      SET read = 1
      WHERE user_id = ? AND read = 0
    `;
    const result = await dbRun(sql, [userId]);
    return result.changes;
  }

  // Delete notification
  static async delete(id, userId) {
    const sql = 'DELETE FROM notifications WHERE id = ? AND user_id = ?';
    const result = await dbRun(sql, [id, userId]);
    return result.changes > 0;
  }

  // Get unread notifications
  static async findUnread(userId) {
    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ? AND read = 0
      ORDER BY created_at DESC
    `;
    return await dbAll(sql, [userId]);
  }

  // Get unread count
  static async getUnreadCount(userId) {
    const sql = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0';
    const result = await dbGet(sql, [userId]);
    return result ? result.count : 0;
  }

  // Delete old notifications
  static async deleteOld(userId, days = 90) {
    const sql = `
      DELETE FROM notifications
      WHERE user_id = ?
      AND DATE(created_at) < DATE('now', '-' || ? || ' days')
    `;
    const result = await dbRun(sql, [userId, days]);
    return result.changes;
  }
}

export default Notification;
