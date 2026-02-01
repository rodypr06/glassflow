import { dbGet, dbAll, dbRun } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  // Find all users (admin use only)
  static async findAll() {
    const sql = 'SELECT id, email, name, created_at, updated_at FROM users ORDER BY created_at DESC';
    return await dbAll(sql);
  }

  // Find user by ID (without password)
  static async findById(id) {
    const sql = 'SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?';
    return await dbGet(sql, [id]);
  }

  // Find user by email (with password for auth)
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await dbGet(sql, [email]);
  }

  // Create new user
  static async create(data) {
    const { email, password, name } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `;
    const result = await dbRun(sql, [email, hashedPassword, name]);
    return await this.findById(result.id);
  }

  // Update user
  static async update(id, data) {
    const { name, email } = data;
    const sql = `
      UPDATE users
      SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await dbRun(sql, [name, email, id]);
    return await this.findById(id);
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await dbRun(sql, [hashedPassword, id]);
  }

  // Delete user
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await dbRun(sql, [id]);
    return result.changes > 0;
  }

  // Verify password
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}

export default User;
