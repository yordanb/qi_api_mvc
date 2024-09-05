const { getSSById, getSSStaff, getSSMekanik } = require('../models/ssModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getSS(req, res) {
    let name,nrp;
  try {
    const rows = await getSSById(req.params.id);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
        name = rows.data[0].PencetusIde;
        name = name.toLowerCase().split(' ').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        nrp = rows.data[0].NRP;
      const response = rows.data.map((row, index) => ({
        //no: index + 1,
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

async function getSSStaffHandler(req, res) {
    try {
        const rows = await getSSStaff(req.params.id); 
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                mp_nrp: row.mp_nrp,
                mp_nama: row.mp_nama,
                JmlSS: row.JmlSS
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

async function getSSMekanikHandler(req, res) {
    try {
        const rows = await getSSMekanik(req.params.id);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                mp_nrp: row.mp_nrp,
                mp_nama: row.mp_nama,
                JmlSS: row.JmlSS
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

module.exports = {
  getSS,
  getSSStaffHandler,
  getSSMekanikHandler,
};