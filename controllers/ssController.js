const { getSSById, getSSStaff, getSSMekanik, getAcvhSSPlt2, getSSStaffRank, getAcvhSSMechZeroPlt2, getAcvhSSStaffZeroPlt2, getSSABPlt2 } = require('../models/ssModel');
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
        no: index + 1,
        judul: row.Judul,
        create: row.TanggalLaporan,
        status: row.KategoriSS
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

async function getSSStaffHandler(req, res) {
    try {
        const rows = await getSSStaff(req.params.id); 
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            }));

        let msgWA = `🥇🥈🥉\n*Acvhievement SS Staff ${req.params.id}*\n`;
        rows.data.forEach((rows, i) => {
          let _nrp = rows.mp_nrp;
          let _nama = rows.mp_nama;
          let _jmlSS = rows.JmlSS;
          msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlSS} SS\n`;
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

async function getSSMekanikHandler(req, res) {
    try {
        const rows = await getSSMekanik(req.params.id);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            }));
       
        let msgWA = `🥇🥈🥉\n*Acvhievement SS Mekanik ${req.params.id}*\n`;
        rows.data.forEach((rows, i) => {
          let _nrp = rows.mp_nrp;
          let _nama = rows.mp_nama;
          let _jmlSS = rows.JmlSS;
          msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlSS} SS\n`;
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

async function getSSAcvhPlt2Handler(req,res) {
    try {
        const rows = await getAcvhSSPlt2(); 
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: row.label,
                value: row.value,
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS Acvh", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSSStaffRankHandler(req, res) {
    try {
        const rows = await getSSStaffRank();
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            })); //console.log(response);

        let msgWA = `🥇🥈🥉\n*Acvhievement SS Staff Plant 2*\n`;
        rows.data.forEach((row, i) => {
          let _nrp = row.mp_nrp;
          let _nama = row.mp_nama;
          let _jmlSS = row.JmlSS;
          let _crew = row.mp_crew;
          msgWA += `${i + 1}. ${_nama}\n    (${_nrp}) = ${_jmlSS} SS\n     ${_crew}\n`;
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

async function getAcvhSSMechZeroPlt2Handler(req,res) {
    try {
        const rows = await getAcvhSSMechZeroPlt2();
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: row.label,
                value: row.value.toString(),
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS Zero Mech", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAcvhSSStaffZeroPlt2Handler(req,res) {
    try {
        const rows = await getAcvhSSStaffZeroPlt2();
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                label: row.label,
                value: row.value.toString(),
            }));

            res.json({ status: 200, error: null, update: update, kpi: "SS Zero Staff", response });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSSABPlt2Handler(req,res) {
    try {
        const rows = await getSSABPlt2(); //console.log(rows);
        let update = await formatTimestamp(rows.lastUpdate);
        if (rows.data && rows.data.length > 0) {
            const response = rows.data.map((row, index) => ({
                no: index + 1,
                nrp: row.mp_nrp,
                nama: row.mp_nama,
                crew: row.mp_crew,
                JmlSS: row.JmlSS
            })); 
            
            res.json({ status: 200, error: null, update: update, kpi: "SS AB Staff", response });
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
  getSSAcvhPlt2Handler,
  getSSStaffRankHandler,
  getAcvhSSMechZeroPlt2Handler,
  getAcvhSSStaffZeroPlt2Handler,
  getSSABPlt2Handler,
};
