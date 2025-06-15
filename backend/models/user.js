const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
    const values = [email, hashedPassword];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = User; 