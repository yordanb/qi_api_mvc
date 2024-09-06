const pool = require('../config/db');

async function getJarvisById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM tb_esictm_plt2 WHERE NRP = ?', [id]); console.log;
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    }; console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getJarvisStaff(section) {
  try {
    const [rows] = await pool.execute(`
      SELECT tb_manpower_new.NRP as mp_nrp, 
             tb_manpower_new.Nama as mp_nama, 
             tb_manpower_new.Crew as mp_posisi, 
             tb_esictm_plt2.JmlDoc as JmlDoc, 
             tb_esictm_plt2.ESIC as esic_status  
      FROM tb_manpower_new 
      LEFT JOIN tb_esictm_plt2 
      ON tb_manpower_new.NRP = tb_esictm_plt2.NRP 
      WHERE tb_manpower_new.Posisi = "Staff" 
      AND tb_manpower_new.Status = "Aktif" 
      AND tb_manpower_new.Section = ? 
      ORDER BY JmlDoc ASC`, [section]);
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

//SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", ANY_VALUE(`tb_esictm_plt2`.`JmlDoc`) as "JmlDoc", ANY_VALUE(`tb_esictm_plt2`.`ESIC`) as "esic_status"  FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_esictm_plt2` on `tb_manpower_new`.`NRP` = `tb_esictm_plt2`.`NRP` where `tb_manpower_new`.`Status` ="Aktif" and `tb_manpower_new`.`Crew`=? AND `tb_manpower_new`.`NRP` NOT LIKE "MM%" order by JmlDoc ASC'

async function getJarvisMekanik(id) {
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
      SELECT tb_manpower_new.NRP as mp_nrp, 
             tb_manpower_new.Nama as mp_nama, 
             tb_manpower_new.Crew as mp_posisi, 
             tb_esictm_plt2.JmlDoc as JmlDoc, 
             tb_esictm_plt2.ESIC as esic_status  
      FROM tb_manpower_new 
      LEFT JOIN tb_esictm_plt2 
      ON tb_manpower_new.NRP = tb_esictm_plt2.NRP 
      WHERE tb_manpower_new.Posisi = "Mekanik" 
      AND tb_manpower_new.Status = "Aktif" 
      AND tb_manpower_new.Crew=?
      AND tb_manpower_new.NRP NOT LIKE "MM%" 
      ORDER BY JmlDoc ASC`, [section]); 
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

async function getLastUpdate() {
  try {
      const [dataUpdate] = await pool.execute(`
          SELECT tb_esictm_plt2.Update FROM db_qiagent.tb_esictm_plt2 LIMIT 1`);
      return dataUpdate.length > 0 ? dataUpdate[0].Update : null;
  } catch (error) {
      console.error('Error fetching LastUpdate:', error);
      throw error;
  }
}

module.exports = {
  getJarvisById,
  getJarvisStaff,
  getJarvisMekanik
};