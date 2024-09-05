const { getIpeakById, getIpeakStaff, getIpeakMekanik } = require('../models/ipeakModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getIpeak(req, res) {
    let name,nrp;
  try {
    const rows = await getIpeakById(req.params.id);
    if (rows.length > 0) {
        name = rows[0].PencetusIde;
        name = name.toLowerCase().split(' ').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        nrp = rows[0].NRP;
      const response = rows.map((row, index) => ({
        no: index + 1,
        judul: row.Judul,
        create: row.TanggalLaporan,
        status: row.KategoriSS
      }));
      res.json({ status: 200, error: null, nama: name, nrp: nrp, response });
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
    if (rows.length > 0) {
      const response = rows.map((row, index) => ({
        no: index + 1,
        mp_nrp: row.mp_nrp,
        mp_nama: row.mp_nama,
        JmlAkses: row.FrekAkses === 0 ? 'belum akses' : row.FrekAkses + 'x'
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

async function getIpeakMekanikHandler(req, res) {
  try {
    const rows = await getIpeakMekanik(req.params.id);
    if (rows.length > 0) {
      const response = rows.map((row, index) => ({
        no: index + 1,
        mp_nrp: row.mp_nrp,
        mp_nama: row.mp_nama,
        JmlAkses: row.FrekAkses === 0 ? 'belum akses' : row.FrekAkses + 'x'
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

module.exports = {
  getIpeak,
  getIpeakStaffHandler,
  getIpeakMekanikHandler,
};