import { dbGet, dbAll, dbRun } from '../config/database.js';

class Subscription {
  // Find all subscriptions for a user
  static async findAll(userId) {
    const sql = `
      SELECT * FROM subscriptions
      WHERE user_id = ?
      ORDER BY next_due_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Find subscription by ID (with user filtering)
  static async findById(id, userId) {
    const sql = 'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?';
    return await dbGet(sql, [id, userId]);
  }

  // Create new subscription
  static async create(data) {
    const { user_id, name, service, amount, billing_cycle, next_due_date, category, active } = data;
    const sql = `
      INSERT INTO subscriptions (user_id, name, service, amount, billing_cycle, next_due_date, category, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [user_id, name, service, amount, billing_cycle, next_due_date, category, active !== false ? 1 : 0]);
    return await this.findById(result.id, user_id);
  }

  // Update subscription
  static async update(id, userId, data) {
    const { name, service, amount, billing_cycle, next_due_date, category, active } = data;
    const sql = `
      UPDATE subscriptions
      SET name = ?, service = ?, amount = ?, billing_cycle = ?, next_due_date = ?,
          category = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    await dbRun(sql, [name, service, amount, billing_cycle, next_due_date, category, active !== false ? 1 : 0, id, userId]);
    return await this.findById(id, userId);
  }

  // Delete subscription
  static async delete(id, userId) {
    const sql = 'DELETE FROM subscriptions WHERE id = ? AND user_id = ?';
    const result = await dbRun(sql, [id, userId]);
    return result.changes > 0;
  }

  // Get active subscriptions
  static async findActive(userId) {
    const sql = `
      SELECT * FROM subscriptions
      WHERE user_id = ? AND active = 1
      ORDER BY next_due_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Get upcoming payments
  static async findUpcoming(userId, days = 30) {
    const sql = `
      SELECT * FROM subscriptions
      WHERE user_id = ? AND active = 1
      AND DATE(next_due_date) <= DATE('now', '+' || ? || ' days')
      ORDER BY next_due_date ASC
    `;
    return await dbAll(sql, [userId, days]);
  }
}

export default Subscription;
