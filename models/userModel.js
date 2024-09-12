const pool = require('../config/db');

async function getRoleByNRP(nrp,password) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM tb_users WHERE nrp = ? AND password = ?`, [nrp,password]);
    if (rows.length > 0){
      //return rows[0].Role; 
      return rows;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRoleByAndroidID(devID) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM tb_qi_users WHERE android_id = ?`, [devID]);
    if (rows.length > 0){
      return rows;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getRoleByNRP,
  getRoleByAndroidID
};