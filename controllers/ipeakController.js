const { getIpeakById, getIpeakStaff, getIpeakMekanik } = require('../models/ipeakModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getIpeak(req, res) {
    let name,nrp;
  try {
    const rows = await getIpeakById(req.params.id); //console.log(rows);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
        name = rows.data[0].Nama;
        name = name.toLowerCase().split(' ').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        nrp = rows.data[0].NRP;
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        judul: row.Judul,
        akses: formatTimestampX(row.DateAccess),
      }));
      res.json({ status: 200, error: null, nama: name, nrp: nrp, update: update, response });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getIpeakStaffHandler(req, res) {
  try {
    const rows = await getIpeakStaff(req.params.id);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        //no: index + 1,
        nrp: row.mp_nrp,
        nama: row.mp_nama,
        akses: row.FrekAkses === 0 ? 'belum akses' : row.FrekAkses + 'x'
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

async function getIpeakMekanikHandler(req, res) {
  try {
    const rows = await getIpeakMekanik(req.params.id);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        nrp: row.mp_nrp,
        nama: row.mp_nama,
        akses: row.FrekAkses === 0 ? 'belum akses' : row.FrekAkses + 'x'
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

function formatTimestampX(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' }; // Format hanya untuk tanggal
  return date.toLocaleDateString('en-GB', options); // Menghasilkan "5 Aug 2024"
}

module.exports = {
  getIpeak,
  getIpeakStaffHandler,
  getIpeakMekanikHandler,
};