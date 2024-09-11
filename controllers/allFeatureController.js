const { getAcvhSSById } = require('../models/ssModel');
const { getAcvhIpeakById } = require('../models/ipeakModel');
const { getAcvhJarvisById } = require('../models/jarvisModel');
const { getAcvhSAPById } = require('../models/sapModel');

const { formatTimestamp } = require('../utils/dateUtils');
let dataSS, dataSAP, dataIpeak, dataJarvis;

async function getAllData(req, res) {
  try {
    
    const rowsSS = await getAcvhSSById(req.params.id);
    if (rowsSS.data && rowsSS.data.length > 0) {
        dataSS = rowsSS.data[0].AcvhSS;
    } else {
        dataSS = null;
    }
    const rowsSAP = await getAcvhSAPById(req.params.id);
    if (rowsSAP.data && rowsSAP.data.length > 0) {
        dataSAP = rowsSAP.data[0].AcvhSAP;
    } else {
        dataSAP = null;
    }
    const rowsIpeak = await getAcvhIpeakById(req.params.id);
    if (rowsIpeak.data && rowsIpeak.data.length > 0) {
        dataIpeak = rowsIpeak.data[0].AcvhIpeak;
    } else {
        dataIpeak = null;
    }
    const rowsJarvis = await getAcvhJarvisById(req.params.id);
    if (rowsJarvis.data && rowsJarvis.data.length > 0) {
        dataJarvis = rowsJarvis.data[0].AcvhJarvis;
    } else {
        dataJarvis = null;
    }

    let updateSS = await formatTimestamp(rowsSS.lastUpdate);
    let updateSAP = await formatTimestamp(rowsSAP.lastUpdate);
    let updateIpeak = await formatTimestamp(rowsIpeak.lastUpdate);
    let updateJarvis = await formatTimestamp(rowsJarvis.lastUpdate);

    // Menyesuaikan data response
    const response = {
      status: 200,
      error: null,
      nrp: req.params.id,
      respon:{
      ss: {
        acvh: dataSS +" SS",
        update: updateSS
      },
      sap: {
        acvh: dataSAP +" %",
        update: updateSAP
      },
      ipeak: {
        acvh: dataIpeak  +"x",
        update: updateIpeak
      },
      jarvis: {
        acvh: dataJarvis +" doc",
        update: updateJarvis
      }
    }
    };

    res.json(response);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllData
};