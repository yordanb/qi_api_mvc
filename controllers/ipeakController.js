const { getIpeakById, getIpeakStaff, getIpeakMekanik, getAcvhIpeakPlt2 } = require('../models/ipeakModel');
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
        no: index + 1,
        nrp: row.mp_nrp,
        nama: row.mp_nama,
        crew: row.mp_crew,
        akses: row.FrekAkses //=== 0 ? 'belum akses' : row.FrekAkses + 'x'
      }));

    let msgWA = `🥇🥈🥉\n*Achievement iPeak Staff ${req.params.id}*\n`;
      rows.data.forEach((row, i) => {
        let _nrp = row.mp_nrp;
        let _nama = row.mp_nama;
        let _jmlIpeak = row.FrekAkses;
          if(_jmlIpeak > 0){
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlIpeak}x akses\n`;
          }
          else{
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = belum akses\n`;
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

async function getIpeakMekanikHandler(req, res) {
  try {
    const rows = await getIpeakMekanik(req.params.id);
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        nrp: row.mp_nrp,
        nama: row.mp_nama,
        crew: row.mp_crew,
        akses: row.FrekAkses //=== 0 ? 'belum akses' : row.FrekAkses + 'x'
      }));

    let msgWA = `🥇🥈🥉\n*Achievement iPeak Mekanik ${req.params.id}*\n`;
      rows.data.forEach((row, i) => {
        let _nrp = row.mp_nrp;
        let _nama = row.mp_nama;
        let _jmlIpeak = row.FrekAkses;
          if(_jmlIpeak > 0){
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlIpeak}x akses\n`;
          }
          else{
             msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = belum akses\n`;
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

async function getIpeakAcvhPlt2Handler(req, res) {
  try {
    const rows = await getAcvhIpeakPlt2();
    let update = await formatTimestamp(rows.lastUpdate);
    if (rows.data && rows.data.length > 0) {
      const response = rows.data.map((row, index) => ({
        no: index + 1,
        label: row.label,
        value: row.value,
    }));
      res.json({ status: 200, error: null, update: update, kpi: "Ipeak Acvh", response });
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
  getIpeakAcvhPlt2Handler,
};
