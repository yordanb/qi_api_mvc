const { getJarvisById, getJarvisStaff, getJarvisMekanik, getAcvhJarvisPlt2 } = require('../models/jarvisModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getJarvis(req, res) {
  let name,nrp,jmlDoc;
  try {
    const rows = await getJarvisById(req.params.id);
    let update = await formatTimestamp(rows.lastUpdate);
    name = capitalizeWords(rows.data[0].Nama, capitalizeFirstLetter),
    nrp = rows.data[0].NRP;
    jmlDoc = rows.data[0].JmlDoc;
    if (rows.data && rows.data.length > 0) {
      /*
      const response = rows.data.NamaDoc.map((row, index) => ({
        //nrp: row.data.NRP,
        //nama: capitalizeWords(row.data.Nama, capitalizeFirstLetter),
        //jmlDoc: row.data.JmlDoc,
        //esictm: row.data.ESIC,
        namaDoc: row.data.NamaDoc.toLowerCase().split("\n")
      }));
      */
      res.json({ status: 200, error: null, nama: name, nrp: nrp, update: update, doc: jmlDoc +" doc"});//, response });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getJarvisStaffHandler(req, res) {
  try {
    const rows = await getJarvisStaff(req.params.id); //console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) { //console.log(rows);
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        nrp: row.mp_nrp,
        nama: capitalizeWords(row.mp_nama, capitalizeFirstLetter),
        crew: row.mp_posisi,
        doc: row.JmlDoc //=== 0 ? 'belum akses' : row.JmlDoc + " doc"
      }));

      let msgWA = `🥇🥈🥉\n*Achievement Jarvis Staff ${req.params.id}*\n`;
      rows.data.forEach((row, i) => {
        let _nrp = row.mp_nrp;
        let _nama = capitalizeWords(row.mp_nama, capitalizeFirstLetter);
        let _jmlDocJarvis = row.JmlDoc;
        if(_jmlDocJarvis != 0){
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlDocJarvis} doc dibaca\n`;
          }
          else{
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = belum akses Jarvis\n`;
          }
      });
      msgWA += 'Last update :\n' + update + '\n'; 
      msgWA += `Terima kasih atas kontribusi aktifnya.`;

      res.json({ status: 200, error: null, update: update, response, wa: msgWA });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getJarvisMekanikHandler(req, res) {
  try {
    const rows = await getJarvisMekanik(req.params.id);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        nrp: row.mp_nrp,
        nama: capitalizeWords(row.mp_nama, capitalizeFirstLetter),
        crew: row.mp_posisi,
        doc: row.JmlDoc //=== 0 ? 'belum akses' : row.JmlDoc + " doc",
      }));

    let msgWA = `🥇🥈🥉\n*Achievement Jarvis Mekanik ${req.params.id}*\n`;
      rows.data.forEach((row, i) => {
        let _nrp = row.mp_nrp;
        let _nama = capitalizeWords(row.mp_nama, capitalizeFirstLetter);
        let _jmlDocJarvis = row.JmlDoc;
        if(_jmlDocJarvis != 0){
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlDocJarvis} doc dibaca\n`;
          }
          else{
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = belum akses Jarvis\n`;
          }
      });
      msgWA += 'Last update :\n' + update + '\n';
      msgWA += `Terima kasih atas kontribusi aktifnya.`;

      res.json({ status: 200, error: null, update: update, response, wa: msgWA });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getJarvisAcvhPlt2Handler(req, res) {
  try {
    const rows = await getAcvhJarvisPlt2();
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        label: row.label,
        value: row.value,
      }));
      res.json({ status: 200, error: null, update: update, kpi: "Jarvis Acvh", response});
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


function capitalizeWords(name, callback) {
  const result = name.toLowerCase().split(' ').map(callback).join(' ');
  return result;
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}



module.exports = {
  getJarvis,
  getJarvisStaffHandler,
  getJarvisMekanikHandler,
  getJarvisAcvhPlt2Handler,
};
