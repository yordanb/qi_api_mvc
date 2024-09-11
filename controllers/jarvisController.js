const { getJarvisById, getJarvisStaff, getJarvisMekanik } = require('../models/jarvisModel');
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
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        nrp: row.mp_nrp,
        nama: capitalizeWords(row.mp_nama, capitalizeFirstLetter),
        doc: row.JmlDoc === 0 ? 'belum akses' : row.JmlDoc + " doc"
      }));
      res.json({ status: 200, error: null, update: update, crew: "staff " + req.params.id, response });
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
        nrp: row.mp_nrp,
        nama: capitalizeWords(row.mp_nama, capitalizeFirstLetter),
        doc: row.JmlDoc === 0 ? 'belum akses' : row.JmlDoc + " doc",
      }));
      res.json({ status: 200, error: null, update: update, crew: "mekanik " + req.params.id, response });
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
};