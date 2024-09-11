const pool = require('../config/db');

async function getSAPById(id) {
  try {
    const [rows] = await pool.execute('SELECT `tb_manpower_new`.`NRP` as "mp_nrp", `tb_manpower_new`.`Nama` as "mp_nama", `tb_manpower_new`.`Crew` as "mp_crew", `tb_manpower_new`.`Posisi` as "mp_posisi", `tb_sap_plt2`.`NRP` as "sap_nrp", `tb_sap_plt2`.`JumlahHariWajibHadirPerBulan` as "sap_hadir", `tb_sap_plt2`.`CompletenessKTA` as "KTAAcvh", `tb_sap_plt2`.`KTACompleted` as "KTACompleted", `tb_sap_plt2`.`CompletenessTTA` as "TTAAcvh", `tb_sap_plt2`.`TTACompleted` as "TTACompleted", `tb_sap_plt2`.`TindakanAman` as "TA", `tb_sap_plt2`.`KondisiAman` as "KA", `tb_sap_plt2`.`Ach_SAP` as "AcvhSAP" FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_sap_plt2` on `tb_manpower_new`.`NRP` = `tb_sap_plt2`.`NRP` where `tb_manpower_new`.`NRP` =? AND `tb_manpower_new`.`Status`="Aktif"', [id]);
    //return rows;
    const LastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: LastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getSAPStaff(section) {
  try {
    const [rows] = await pool.execute(`SELECT tb_manpower_new.NRP as "mp_nrp", tb_manpower_new.Nama as "mp_nama", tb_manpower_new.Crew as "mp_crew", tb_sap_plt2.NRP as "sap_nrp", tb_sap_plt2.JumlahHariWajibHadirPerBulan as "sap_hadir", tb_sap_plt2.CompletenessKTA as "KTAAcvh", tb_sap_plt2.KTACompleted as "KTACompleted", tb_sap_plt2.CompletenessTTA  as "TTAAcvh", tb_sap_plt2.TTACompleted as "TTACompleted", tb_sap_plt2.TindakanAman as "TA", tb_sap_plt2.KondisiAman as "KA", tb_sap_plt2.Ach_SAP as "AcvhSAP" FROM db_qiagent.tb_manpower_new LEFT JOIN db_qiagent.tb_sap_plt2 on tb_manpower_new.NRP = tb_sap_plt2.NRP WHERE tb_manpower_new.Posisi ="Staff" AND tb_manpower_new.Section =? AND tb_sap_plt2.NRP is not null order by AcvhSAP ASC`, [section]);
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

async function getSAPMekanik(id) {
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
   const [rows] = await pool.execute(`SELECT tb_manpower_new.NRP as "mp_nrp", tb_manpower_new.Nama as "mp_nama", tb_manpower_new.Crew as "mp_crew", tb_sap_plt2.NRP as "sap_nrp", tb_sap_plt2.JumlahHariWajibHadirPerBulan as "sap_hadir", tb_sap_plt2.CompletenessKTA as "KTAAcvh", tb_sap_plt2.KTACompleted as "KTACompleted", tb_sap_plt2.CompletenessTTA  as "TTAAcvh", tb_sap_plt2.TTACompleted as "TTACompleted", tb_sap_plt2.TindakanAman as "TA", tb_sap_plt2.KondisiAman as "KA", tb_sap_plt2.Ach_SAP as "AcvhSAP" FROM db_qiagent.tb_manpower_new LEFT JOIN db_qiagent.tb_sap_plt2 on tb_manpower_new.NRP = tb_sap_plt2.NRP WHERE tb_manpower_new.Posisi ="Mekanik" AND tb_manpower_new.Crew =? AND tb_sap_plt2.NRP is not null order by AcvhSAP ASC`, [section]);
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

async function getAcvhSAPById(id) {
  try {
    const [rows] = await pool.execute('SELECT `tb_sap_plt2`.`Ach_SAP` as "AcvhSAP" FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_sap_plt2` on `tb_manpower_new`.`NRP` = `tb_sap_plt2`.`NRP` where `tb_manpower_new`.`NRP` =? AND `tb_manpower_new`.`Status`="Aktif"', [id]);
    const LastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: LastUpdate,
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
            SELECT tb_sap_plt2.LastUpdate FROM db_qiagent.tb_sap_plt2 LIMIT 1`); //console.log(dataUpdate);
        return dataUpdate.length > 0 ? dataUpdate[0].LastUpdate : null;
    } catch (error) {
        console.error('Error fetching LastUpdate:', error);
        throw error;
    }
}

module.exports = {
  getSAPById,
  getSAPStaff,
  getSAPMekanik,
  getAcvhSAPById,
};