const { getJarvisById, getJarvisStaff, getJarvisMekanik } = require('../models/jarvisModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getJarvis(req, res) {
  try {
    const rows = await getJarvisById(req.params.id);
    if (rows.length > 0) {
      const response = rows.map((row, index) => ({
        nrp: row.NRP,
        nama: capitalizeWords(row.Nama, capitalizeFirstLetter),
        jmlDoc: row.JmlDoc,
        esictm: row.ESIC,
        namaDoc: row.NamaDoc.toLowerCase().split("\n")
      }));
      res.json({ status: 200, error: null, response });
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
    const rows = await getJarvisStaff(req.params.id); console.log(rows);
    if (rows.length > 0) {
      const response = rows.map((row, index) => ({
        no: index + 1,
        mp_nrp: row.mp_nrp,
        mp_nama: capitalizeWords(row.mp_nama, capitalizeFirstLetter),
        JmlDoc: row.JmlDoc,
      }));
      res.json({ status: 200, error: null, response });
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
    if (rows.length > 0) {
      const response = rows.map((row, index) => ({
        no: index + 1,
        mp_nrp: row.mp_nrp,
        mp_nama: capitalizeWords(row.mp_nama, capitalizeFirstLetter),
        JmlDoc: row.JmlDoc,
      }));
      res.json({ status: 200, error: null, response });
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