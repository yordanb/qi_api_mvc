const pool = require('../config/db');

async function getIpeakById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM tb_ipeak_plt2 WHERE NRP = ?', [id]); console.log;
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getIpeakStaff(section) {
  try {
    const [rows] = await pool.execute(`
      SELECT tb_manpower_new.NRP as "mp_nrp",
      tb_manpower_new.Nama as "mp_nama",
      tb_manpower_new.Crew as "mp_crew",
      COUNT(tb_ipeak.Nama) AS "FrekAkses" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ipeak on tb_manpower_new.NRP = tb_ipeak.NRP where tb_manpower_new.Status ="Aktif" and tb_manpower_new.Posisi="Staff" and tb_manpower_new.Section = ? GROUP by tb_manpower_new.Nama  ORDER BY FrekAkses ASC`, [section]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getIpeakMekanik(id) {
  switch (id) {
    case "pch":
      section = "mekanik pch";
      break;
    case "mobile":
      section = "mekanik mobile";
      break;
    case "big wheel":
      section = "mekanik big wheel";
      break;
    case "lighting":
      section = "mekanik lighting";
      break;
    case "pumping":
      section = "mekanik pumping";
      break;
}
  try {
    const [rows] = await pool.execute(`
      SELECT tb_manpower_new.NRP as "mp_nrp",
      tb_manpower_new.Nama as "mp_nama",
      tb_manpower_new.Crew as "mp_crew",
      COUNT(tb_ipeak.Nama) AS "FrekAkses" FROM db_qiagent.tb_manpower_new
      left join db_qiagent.tb_ipeak on tb_manpower_new.NRP = tb_ipeak.NRP where tb_manpower_new.Status ="Aktif" and tb_manpower_new.NRP NOT LIKE "MM%" and tb_manpower_new.Posisi="Mekanik" and tb_manpower_new.Crew = ? GROUP by tb_manpower_new.Nama  ORDER BY FrekAkses ASC`, [section]); console.log(rows);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getIpeakById,
  getIpeakStaff,
  getIpeakMekanik
};