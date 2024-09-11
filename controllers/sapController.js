const { getSAPById, getSAPStaff, getSAPMekanik } = require('../models/sapModel');
const { formatTimestamp } = require('../utils/dateUtils');

async function getSAP(req, res) {
    let name,nrp;
  try {
    const rows = await getSAPById(req.params.id);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
        name = rows.data[0].mp_nama;
        name = name.toLowerCase().split(' ').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        nrp = rows.data[0].mp_nrp;
      const response = rows.data.map((row, index) => ({
        hari_hadir: row.sap_hadir,
        kta_acvh: row.KTAAcvh,
        kta_comp: row.KTACompleted,
        tta_acvh: row.TTAAcvh,
        tta_comp: row.TTACompleted,
        ta: row.TA,
        ka: row.KA,
        acvh_sap: row.AcvhSAP
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

async function getSAPStaffHandler(req, res) {
    try {
        const rows = await getSAPStaff(req.params.id); 
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                sap: row.AcvhSAP +" %"
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

async function getSAPMekanikHandler(req, res) {
    try {
        const rows = await getSAPMekanik(req.params.id);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                sap: row.AcvhSAP +" %"
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
  getSAP,
  getSAPStaffHandler,
  getSAPMekanikHandler,
};