const pool = require('../config/db');

async function getRoleByEmail(email) {
  try {
    const [rows] = await pool.execute('SELECT * FROM tb_users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return rows[0].Role;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getRoleByEmail
};