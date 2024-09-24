const pool = require('../config/db');

async function getSSById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM tb_ssplt2 WHERE NRP = ?', [id]);
    //return rows;
    //const [nama] = await pool.execute('SELECT Nama, NRP FROM tb_manpower_new WHERE NRP = ?', [id]);
    const lastUpdate = await getLastUpdate();

    const modifiedRows = rows.map(row => ({
      ...row,
      Judul: toBeginningOfSentenceCase(row.Judul) // Terapkan fungsi kapitalisasi
    }));

    const result = {
        //name: nama.Nama,
        lastUpdate: lastUpdate,
        data: modifiedRows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getSSStaff(section) {
  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as mp_nrp, ANY_VALUE(`tb_manpower_new`.`Nama`) as mp_nama, ANY_VALUE(`tb_manpower_new`.`Crew`) as mp_crew,COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Posisi ="Staff" and tb_manpower_new.Status ="Aktif" and tb_manpower_new.Section=? GROUP by tb_manpower_new.Nama  ORDER BY COUNT(tb_ssplt2.NomorSS) ASC', [section]);
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
   const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new LEFT JOIN db_qiagent.tb_ssplt2 ON tb_manpower_new.NRP = tb_ssplt2.NRP WHERE tb_manpower_new.Posisi = "Mekanik" AND tb_manpower_new.Status = "Aktif" AND tb_manpower_new.Crew = ? GROUP BY tb_manpower_new.Nama ORDER BY COUNT(tb_ssplt2.NomorSS) ASC', [section]);
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
    const [nama] = await pool.execute('SELECT Nama, NRP FROM tb_manpower_new WHERE NRP = ?', [id]);
    const [rows] = await pool.execute('SELECT COUNT(*) AS "AcvhSS" FROM tb_ssplt2 WHERE NRP = ?', [id]);
    const lastUpdate = await getLastUpdate();

    const result = {
        name: nama[0].Nama,
        lastUpdate: lastUpdate,
        data: rows
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAcvhSSPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 135.0 * 100, 0), 1) AS value, "Lighting" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE Crew = "Staff SSE Lighting" OR Crew = "Mekanik Lighting") AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 210.0 * 100, 0), 1) AS value, "Mobile" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE Crew = "Staff SSE Mobile" OR Crew = "Mekanik Mobile") AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 350.0 * 100, 0), 1) AS value, "Pumping" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE Crew = "Staff SSE Pumping" OR Crew = "Mekanik Pumping") AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 265.0 * 100, 0), 1) AS value, "PCH" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "PCH" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 205.0 * 100, 0), 1) AS value, "Big Wheel" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "Big Wheel" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 35.0 * 100, 0), 1) AS value, "LCE" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "LCE" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 25.0 * 100, 0), 1) AS value, "MTE" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "TERE" GROUP BY Nama, section) AS subquery UNION ALL SELECT ROUND(COALESCE(SUM(subquery.Jml_SS) / 10.0 * 100, 0), 1) AS value, "PSC" AS label FROM (SELECT COUNT(*) AS Jml_SS FROM db_qiagent.tb_manpower_new INNER JOIN db_qiagent.tb_ssplt2 USING (NRP) WHERE section = "PSC" GROUP BY Nama, section) AS subquery ORDER BY value DESC;');
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

async function getSSStaffRank() {
  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Posisi ="Staff" and tb_manpower_new.Status ="Aktif"  GROUP by tb_manpower_new.Nama  ORDER BY COUNT(tb_ssplt2.NomorSS) ASC');
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

async function getAcvhSSMechZeroPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Lighting" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Lighting" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Mobile" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Mobile" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Pumping" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Pumping" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "PCH" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik PCH" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1), "Big Wheel" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew = "Mekanik Big Wheel" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery ORDER BY value DESC;');
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    };  //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAcvhSSStaffZeroPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Lighting" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff SSE Lighting" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Mobile" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff SSE Mobile" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "Pumping" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff SSE Pumping" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "PCH" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff PCH" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1), "Big Wheel" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Crew ="Staff Big Wheel" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "LCE" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Section ="LCE" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "MTE" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Section ="TERE" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery UNION ALL SELECT ROUND(COALESCE(COUNT(*) * 1, 0), 1) AS value, "PSC" AS label FROM (SELECT ANY_VALUE(tb_manpower_new.NRP) as "mp_nrp", ANY_VALUE(tb_manpower_new.Nama) as "mp_nama", ANY_VALUE(tb_manpower_new.Crew) as "mp_crew", ANY_VALUE(tb_manpower_new.Status) as "mp_status", ANY_VALUE(tb_ssplt2.NRP) as "ss_nrp", COUNT(tb_ssplt2.NomorSS) AS "JmlSS" FROM db_qiagent.tb_manpower_new left join db_qiagent.tb_ssplt2 on tb_manpower_new.NRP = tb_ssplt2.NRP where tb_manpower_new.Section ="PSC" and tb_manpower_new.Status LIKE "Aktif" and tb_ssplt2.NRP is null GROUP by tb_manpower_new.Nama) AS subquery ORDER BY value DESC;');
    const lastUpdate = await getLastUpdate();

    const result = {
        lastUpdate: lastUpdate,
        data: rows
    };  //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getSSABPlt2() {
  try {
    const [rows] = await pool.execute('SELECT ANY_VALUE(`tb_manpower_new`.`NRP`) as "mp_nrp", ANY_VALUE(`tb_manpower_new`.`Nama`) as "mp_nama", ANY_VALUE(`tb_manpower_new`.`Crew`) as "mp_crew", ANY_VALUE(`tb_manpower_new`.`Status`) as "mp_status", ANY_VALUE(`tb_ssplt2_ab`.`NRP`) as "ss_nrp", COUNT(`tb_ssplt2_ab`.`NomorSS`) AS "JmlSS" FROM `db_qiagent`.`tb_manpower_new` left join `db_qiagent`.`tb_ssplt2_ab` on `tb_manpower_new`.`NRP` = `tb_ssplt2_ab`.`NRP` where `tb_manpower_new`.`Posisi` ="Staff" and `tb_manpower_new`.`Status` ="Aktif"  GROUP by `tb_manpower_new`.`Nama`  ORDER BY COUNT(`tb_ssplt2_ab`.`NomorSS`) ASC');
    const lastUpdate = await getLastUpdateSSAB();

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


async function getSSAcvhYearlyByID(nrp) {
  try {
    const [jan] = await pool.execute('SELECT "Jan" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202401 WHERE NRP = ?;',[nrp]);
    const [feb] = await pool.execute('SELECT "Feb" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202402 WHERE NRP = ?;',[nrp]);
    const [mar] = await pool.execute('SELECT "Mar" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202403 WHERE NRP = ?;',[nrp]);
    const [apr] = await pool.execute('SELECT "Apr" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202404 WHERE NRP = ?;',[nrp]);
    const [mei] = await pool.execute('SELECT "Mei" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202405 WHERE NRP = ?;',[nrp]);
    const [jun] = await pool.execute('SELECT "Jun" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202406 WHERE NRP = ?;',[nrp]);
    const [jul] = await pool.execute('SELECT "Jul" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202407 WHERE NRP = ?;',[nrp]);
    const [agu] = await pool.execute('SELECT "Agu" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202408 WHERE NRP = ?;',[nrp]);
    const [sep] = await pool.execute('SELECT "Sep" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202409 WHERE NRP = ?;',[nrp]);
    const [okt] = await pool.execute('SELECT "Okt" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202410 WHERE NRP = ?;',[nrp]);
    const [nov] = await pool.execute('SELECT "Nov" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202411 WHERE NRP = ?;',[nrp]);
    const [des] = await pool.execute('SELECT "Des" as Bulan, COUNT(*) as JmlSS FROM db_qiagent.tb_ssplt2_202412 WHERE NRP = ?;',[nrp]);
    const lastUpdate = await getLastUpdate(); //console.log(jan[0]);

    const result = {
        lastUpdate: lastUpdate,
        data: [
      {
       "jan": jan[0].JmlSS.toString(),},{
       "feb": feb[0].JmlSS.toString(),},{
       "mar": mar[0].JmlSS.toString(),},{
       "apr": apr[0].JmlSS.toString(),},{
       "mei": mei[0].JmlSS.toString(),},{
       "jun": jun[0].JmlSS.toString(),},{
       "jul": jul[0].JmlSS.toString(),},{
       "agu": agu[0].JmlSS.toString(),},{
       "sep": sep[0].JmlSS.toString(),},{
       "okt": okt[0].JmlSS.toString(),},{
       "nov": nov[0].JmlSS.toString(),},{
       "des": des[0].JmlSS.toString()
      }
    ]
    }; //console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function getLastUpdateSSAB() {
    try {
        const [dataUpdate] = await pool.execute('SELECT tb_ssplt2_ab.update FROM db_qiagent.tb_ssplt2_ab LIMIT 1');
        return dataUpdate.length > 0 ? dataUpdate[0].update : null;
    } catch (error) {
        console.error('Error fetching LastUpdate:', error);
        throw error;
    }
}

async function getLastUpdate() {
    try {
        const [dataUpdate] = await pool.execute('SELECT tb_ssplt2.update FROM db_qiagent.tb_ssplt2 LIMIT 1');
        return dataUpdate.length > 0 ? dataUpdate[0].update : null;
    } catch (error) {
        console.error('Error fetching LastUpdate:', error);
        throw error;
    }
}

function toBeginningOfSentenceCase(text) {
  if (!text) return '';  // Jika text null atau undefined, kembalikan string kosong
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

module.exports = {
  getSSById,
  getSSStaff,
  getSSMekanik,
  getAcvhSSById,
  getAcvhSSPlt2,
  getSSStaffRank,
  getAcvhSSMechZeroPlt2,
  getAcvhSSStaffZeroPlt2,
  getSSABPlt2,
  getSSAcvhYearlyByID,
};
