const pool = require('../config/db');

async function getSSById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM tb_ssplt2 WHERE NRP = ?', [id]);
    //return rows;
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getSSStaff(section) {
  try {
    const [rows] = await pool.execute(`SELECT tb_manpower_new.NRP as mp_nrp,tb_manpower_new.Nama as mp_nama,tb_manpower_new.Crew as mp_crew,COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Posisi ="Staff" and tb_manpower_new.Status ="Aktif" and tb_manpower_new.Section=? GROUP by tb_manpower_new.Nama  ORDER BY COUNT(tb_ssplt2.NomorSS) ASC`, [section]);
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

async function getSSMekanik(id) {
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
    SELECT tb_manpower_new.NRP as mp_nrp, tb_manpower_new.Nama as mp_nama, tb_manpower_new.Crew as mp_crew, COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new LEFT JOIN db_qiagent.tb_ssplt2 ON tb_manpower_new.NRP = tb_ssplt2.NRP WHERE tb_manpower_new.Posisi = "Mekanik" AND tb_manpower_new.Status = "Aktif" AND tb_manpower_new.Crew = ? GROUP BY tb_manpower_new.Nama ORDER BY COUNT(tb_ssplt2.NomorSS) ASC`, [section]);
    const lastUpdate = await getLastUpdate(); //console.log(lastUpdate);

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

async function getAcvhSSById(id) {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) AS "AcvhSS" FROM tb_ssplt2 WHERE NRP = ?', [id]);
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getLastUpdate() {
    try {
        const [dataUpdate] = await pool.execute(`
            SELECT tb_ssplt2.update FROM db_qiagent.tb_ssplt2 LIMIT 1`);
        return dataUpdate.length > 0 ? dataUpdate[0].update : null;
    } catch (error) {
        console.error('Error fetching LastUpdate:', error);
        throw error;
    }
}

module.exports = {
  getSSById,
  getSSStaff,
  getSSMekanik,
  getAcvhSSById,
};