import { dbGet, dbAll, dbRun } from '../config/database.js';

class Loan {
  // Find all loans for a user
  static async findAll(userId) {
    const sql = `
      SELECT * FROM loans
      WHERE user_id = ?
      ORDER BY next_payment_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Find loan by ID (with user filtering)
  static async findById(id, userId) {
    const sql = 'SELECT * FROM loans WHERE id = ? AND user_id = ?';
    return await dbGet(sql, [id, userId]);
  }

  // Create new loan
  static async create(data) {
    const { user_id, name, lender, amount, interest_rate, payment_amount, remaining_balance, next_payment_date, term_months, paid_off } = data;
    const sql = `
      INSERT INTO loans (user_id, name, lender, amount, interest_rate, payment_amount, remaining_balance, next_payment_date, term_months, paid_off)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [user_id, name, lender, amount, interest_rate, payment_amount, remaining_balance, next_payment_date, term_months, paid_off ? 1 : 0]);
    return await this.findById(result.id, user_id);
  }

  // Update loan
  static async update(id, userId, data) {
    const { name, lender, amount, interest_rate, payment_amount, remaining_balance, next_payment_date, term_months, paid_off } = data;
    const sql = `
      UPDATE loans
      SET name = ?, lender = ?, amount = ?, interest_rate = ?, payment_amount = ?,
          remaining_balance = ?, next_payment_date = ?, term_months = ?,
          paid_off = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    await dbRun(sql, [name, lender, amount, interest_rate, payment_amount, remaining_balance, next_payment_date, term_months, paid_off ? 1 : 0, id, userId]);
    return await this.findById(id, userId);
  }

  // Delete loan
  static async delete(id, userId) {
    const sql = 'DELETE FROM loans WHERE id = ? AND user_id = ?';
    const result = await dbRun(sql, [id, userId]);
    return result.changes > 0;
  }

  // Get active loans
  static async findActive(userId) {
    const sql = `
      SELECT * FROM loans
      WHERE user_id = ? AND paid_off = 0
      ORDER BY next_payment_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Get paid off loans
  static async findPaidOff(userId) {
    const sql = `
      SELECT * FROM loans
      WHERE user_id = ? AND paid_off = 1
      ORDER BY updated_at DESC
    `;
    return await dbAll(sql, [userId]);
  }

  // Get loans with upcoming payments
  static async findUpcomingPayments(userId, days = 7) {
    const sql = `
      SELECT * FROM loans
      WHERE user_id = ? AND paid_off = 0
      AND DATE(next_payment_date) >= DATE('now')
      AND DATE(next_payment_date) <= DATE('now', '+' || ? || ' days')
      ORDER BY next_payment_date ASC
    `;
    return await dbAll(sql, [userId, days]);
  }
}

export default Loan;
