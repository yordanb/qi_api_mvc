const express = require('express');
const { getJarvis, getJarvisStaffHandler, getJarvisMekanikHandler } = require('../controllers/jarvisController');
const { getSS, getSSStaffHandler, getSSMekanikHandler } = require('../controllers/ssController');
const { getIpeak, getIpeakStaffHandler, getIpeakMekanikHandler } = require('../controllers/ipeakController');
const router = express.Router();

const authenticateToken = require('../middlewares/authMiddleware');
// Terapkan middleware ke semua route berikutnya
router.use(authenticateToken);

router.get('/jarvis/:id', getJarvis);
router.get('/jarvis-staff/:id', getJarvisStaffHandler);
router.get('/jarvis-mech/:id', getJarvisMekanikHandler);
router.get('/ss/:id', getSS);
router.get('/ss-staff/:id', getSSStaffHandler);
router.get('/ss-mech/:id', getSSMekanikHandler);
router.get('/ipeak/:id', getIpeak);
router.get('/ipeak-staff/:id', getIpeakStaffHandler);
router.get('/ipeak-mech/:id', getIpeakMekanikHandler);

module.exports = router;