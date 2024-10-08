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

async function getRoleByNRPandID(nrp,password,androidID) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM tb_users WHERE nrp = ? AND password = ? AND android_id = ?`, [nrp,password,androidID]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Administrator menggunakan login as feature
async function getRoleByNRPandPassADM(nrp,password) {
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
    const [rows] = await pool.execute(`SELECT * FROM tb_users WHERE android_id = ?`, [devID]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/*
async function regDevByAndroidID(nrp, name, password, androidID) {
  try {
    const [result] = await pool.execute(`INSERT INTO tb_users (NRP, Nama, Password, android_id) VALUES (?, ?, ?, ?);`, [nrp, name, password, androidID]);
    //console.log(result);
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}
*/


async function checkDefaultPassword(androidID){
  try {
    const [rows]= await pool.execute(`SELECT is_default_password FROM tb_users WHERE id = ?;` [androidID]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/*
async function regDevByAndroidID(nrp, name, password, def_password, androidID) {
  //console.log('Data yang dikirimkan:');
  //console.log({ nrp, name, password, def_password, androidID });

  try {
    const [result] = await pool.execute(`UPDATE db_qiagent.tb_users SET Nama = ?, Password = ?, android_id = ?, is_default_password = 1 WHERE nrp = ? AND Def_Password = ?;`, [name, password, androidID, nrp, def_password]);
    //console.log(result);
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}
*/

async function regDevByAndroidID(nrp, name, password, def_password, androidID) {
  try {
    // Cek apakah Android ID sudah terdaftar
    const [existingAndroidID] = await pool.execute(`SELECT COUNT(*) AS count FROM db_qiagent.tb_users WHERE android_id = ?`, [androidID]);
    if (existingAndroidID[0].count > 0) {
      throw new Error('Android ID sudah terdaftar.');
    }
    // Jika tidak terdaftar, lakukan update
    const [result] = await pool.execute(`UPDATE db_qiagent.tb_users SET Nama = ?, Password = ?, android_id = ?, is_default_password = 0 WHERE nrp = ? AND Def_Password = ?;`,[name, password, androidID, nrp, def_password]);
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

module.exports = {
  getRoleByNRP,
  getRoleByAndroidID,
  regDevByAndroidID,
  getRoleByNRPandID,
  checkDefaultPassword,
  getRoleByNRPandPassADM,
};
