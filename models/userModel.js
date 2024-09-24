const pool = require('../config/db');

async function getRoleByNRP(nrp,password) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM tb_users WHERE nrp = ? AND password = ?`, [nrp,password]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRoleByAndroidID(devID) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM tb_qi_users WHERE android_id = ?`, [devID]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function regDevByAndroidID(nrp,name,password,androidID) {
  try {
    const [rows] = await pool.execute(`INSERT INTO tb_qi_users (nrp, name, password, android_id) VALUES(?,?,?,?);`, [nrp,name,password,androidID]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getRoleByNRP,
  getRoleByAndroidID,
  regDevByAndroidID
};