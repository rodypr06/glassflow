import { dbGet, dbAll, dbRun } from '../config/database.js';

class CreditCard {
  // Find all credit cards for a user
  static async findAll(userId) {
    const sql = `
      SELECT * FROM credit_cards
      WHERE user_id = ?
      ORDER BY due_date ASC
    `;
    return await dbAll(sql, [userId]);
  }

  // Find credit card by ID (with user filtering)
  static async findById(id, userId) {
    const sql = 'SELECT * FROM credit_cards WHERE id = ? AND user_id = ?';
    return await dbGet(sql, [id, userId]);
  }

  // Create new credit card
  static async create(data) {
    const { user_id, name, bank, last_4_digits, limit, current_balance, due_date, interest_rate, color } = data;
    const sql = `
      INSERT INTO credit_cards (user_id, name, bank, last_4_digits, limit, current_balance, due_date, interest_rate, color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [user_id, name, bank, last_4_digits, limit, current_balance, due_date, interest_rate, color]);
    return await this.findById(result.id, user_id);
  }

  // Update credit card
  static async update(id, userId, data) {
    const { name, bank, last_4_digits, limit, current_balance, due_date, interest_rate, color } = data;
    const sql = `
      UPDATE credit_cards
      SET name = ?, bank = ?, last_4_digits = ?, limit = ?, current_balance = ?,
          due_date = ?, interest_rate = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    await dbRun(sql, [name, bank, last_4_digits, limit, current_balance, due_date, interest_rate, color, id, userId]);
    return await this.findById(id, userId);
  }

  // Delete credit card
  static async delete(id, userId) {
    const sql = 'DELETE FROM credit_cards WHERE id = ? AND user_id = ?';
    const result = await dbRun(sql, [id, userId]);
    return result.changes > 0;
  }

  // Get credit utilization
  static async getUtilization(id, userId) {
    const card = await this.findById(id, userId);
    if (!card) return null;
    const utilization = card.current_balance > 0 && card.limit > 0
      ? Math.round((card.current_balance / card.limit) * 100)
      : 0;
    return { ...card, utilization };
  }

  // Get cards with high utilization (> 70%)
  static async findHighUtilization(userId, threshold = 70) {
    const cards = await this.findAll(userId);
    return cards.filter(card => {
      const utilization = card.current_balance > 0 && card.limit > 0
        ? (card.current_balance / card.limit) * 100
        : 0;
      return utilization > threshold;
    }).map(card => ({
      ...card,
      utilization: Math.round((card.current_balance / card.limit) * 100)
    }));
  }
}

export default CreditCard;
