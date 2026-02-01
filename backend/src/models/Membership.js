import { dbGet, dbAll, dbRun } from '../config/database.js';

class Membership {
  // Find all memberships for a user
  static async findAll(userId) {
    const sql = `
      SELECT * FROM memberships
      WHERE user_id = ?
      ORDER BY renewal_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Find membership by ID (with user filtering)
  static async findById(id, userId) {
    const sql = 'SELECT * FROM memberships WHERE id = ? AND user_id = ?';
    return await dbGet(sql, [id, userId]);
  }

  // Create new membership
  static async create(data) {
    const { user_id, name, provider, amount, renewal_date, category, notes } = data;
    const sql = `
      INSERT INTO memberships (user_id, name, provider, amount, renewal_date, category, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [user_id, name, provider, amount, renewal_date, category, notes]);
    return await this.findById(result.id, user_id);
  }

  // Update membership
  static async update(id, userId, data) {
    const { name, provider, amount, renewal_date, category, notes } = data;
    const sql = `
      UPDATE memberships
      SET name = ?, provider = ?, amount = ?, renewal_date = ?,
          category = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    await dbRun(sql, [name, provider, amount, renewal_date, category, notes, id, userId]);
    return await this.findById(id, userId);
  }

  // Delete membership
  static async delete(id, userId) {
    const sql = 'DELETE FROM memberships WHERE id = ? AND user_id = ?';
    const result = await dbRun(sql, [id, userId]);
    return result.changes > 0;
  }

  // Get expiring memberships
  static async findExpiring(userId, days = 30) {
    const sql = `
      SELECT * FROM memberships
      WHERE user_id = ?
      AND DATE(renewal_date) <= DATE('now', '+' || ? || ' days')
      ORDER BY renewal_date ASC
    `;
    return await dbAll(sql, [userId, days]);
  }
}

export default Membership;
