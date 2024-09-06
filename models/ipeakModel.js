const pool = require('../config/db');

async function getIpeakById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM tb_ipeak WHERE NRP = ?', [id]);
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; 

    return result;
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
      const lastUpdate = await getLastUpdate(); 

      const result = {
          lastUpdate: lastUpdate,
          data: rows
      };
  
      return result;
      } catch (error) {
          console.error('Error fetching data:', error);
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
      left join db_qiagent.tb_ipeak on tb_manpower_new.NRP = tb_ipeak.NRP where tb_manpower_new.Status ="Aktif" and tb_manpower_new.NRP NOT LIKE "MM%" and tb_manpower_new.Posisi="Mekanik" and tb_manpower_new.Crew = ? GROUP by tb_manpower_new.Nama  ORDER BY FrekAkses ASC`, [section]);
      const lastUpdate = await getLastUpdate(); 

      const result = {
          lastUpdate: lastUpdate,
          data: rows
      };
  
      return result;
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
}

async function getLastUpdate() {
  try {
      const [dataUpdate] = await pool.execute(`
        SELECT tb_ipeak.LastUpdate FROM db_qiagent.tb_ipeak LIMIT 1`); 
      return dataUpdate.length > 0 ? dataUpdate[0].LastUpdate : null;
  } catch (error) {
      console.error('Error fetching LastUpdate:', error);
      throw error;
  }
}

module.exports = {
  getIpeakById,
  getIpeakStaff,
  getIpeakMekanik
};