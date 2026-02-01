import { dbGet, dbAll, dbRun } from '../config/database.js';

class Bill {
  // Find all bills for a user
  static async findAll(userId) {
    const sql = `
      SELECT * FROM bills
      WHERE user_id = ?
      ORDER BY due_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Find bill by ID (with user filtering)
  static async findById(id, userId) {
    const sql = 'SELECT * FROM bills WHERE id = ? AND user_id = ?';
    return await dbGet(sql, [id, userId]);
  }

  // Create new bill
  static async create(data) {
    const { user_id, name, amount, due_date, category, status, recurring } = data;
    const sql = `
      INSERT INTO bills (user_id, name, amount, due_date, category, status, recurring)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [user_id, name, amount, due_date, category, status || 'pending', recurring ? 1 : 0]);
    return await this.findById(result.id, user_id);
  }

  // Update bill
  static async update(id, userId, data) {
    const { name, amount, due_date, category, status, recurring } = data;
    const sql = `
      UPDATE bills
      SET name = ?, amount = ?, due_date = ?, category = ?, status = ?,
          recurring = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    await dbRun(sql, [name, amount, due_date, category, status, recurring ? 1 : 0, id, userId]);
    return await this.findById(id, userId);
  }

  // Delete bill
  static async delete(id, userId) {
    const sql = 'DELETE FROM bills WHERE id = ? AND user_id = ?';
    const result = await dbRun(sql, [id, userId]);
    return result.changes > 0;
  }

  // Get bills by status
  static async findByStatus(userId, status) {
    const sql = `
      SELECT * FROM bills
      WHERE user_id = ? AND status = ?
      ORDER BY due_date ASC
    `;
    return await dbAll(sql, [userId, status]);
  }

  // Get overdue bills
  static async findOverdue(userId) {
    const sql = `
      SELECT * FROM bills
      WHERE user_id = ? AND status = 'pending' AND DATE(due_date) < DATE('now')
      ORDER BY due_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Get upcoming bills
  static async findUpcoming(userId, days = 7) {
    const sql = `
      SELECT * FROM bills
      WHERE user_id = ? AND status = 'pending'
      AND DATE(due_date) >= DATE('now')
      AND DATE(due_date) <= DATE('now', '+' || ? || ' days')
      ORDER BY due_date ASC
    `;
    return await dbAll(sql, [userId, days]);
  }

  // Get recurring bills
  static async findRecurring(userId) {
    const sql = `
      SELECT * FROM bills
      WHERE user_id = ? AND recurring = 1
      ORDER BY due_date ASC
    `;
    return await dbAll(sql, [userId]);
  }
}

export default Bill;
