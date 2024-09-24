const express = require('express');
const { getJarvis, getJarvisStaffHandler, getJarvisMekanikHandler, getJarvisAcvhPlt2Handler } = require('../controllers/jarvisController');
const { getSS, getSSStaffHandler, getSSMekanikHandler, getSSAcvhPlt2Handler, getSSStaffRankHandler, getAcvhSSMechZeroPlt2Handler, getAcvhSSStaffZeroPlt2Handler, getSSABPlt2Handler, getSSAcvhYearlyByIDHandler } = require('../controllers/ssController');
const { getIpeak, getIpeakStaffHandler, getIpeakMekanikHandler, getIpeakAcvhPlt2Handler } = require('../controllers/ipeakController');
const { getSAP, getSAPStaffHandler, getSAPMekanikHandler } = require('../controllers/sapController');
const { getAllData} = require('../controllers/allFeatureController');
const { getAllKPIData } = require('../controllers/allKPIAcvhController');
const { getAllManpowerHandler, getManpowerByIdHandler, updateManpowerByIdHandler, deleteManpowerByIdHandler, addManpowerdHandler } = require('../controllers/manpowerController');

const router = express.Router();

const authenticateToken = require('../middlewares/authMiddleware');
// Terapkan middleware ke semua route berikutnya
router.use(authenticateToken);

//all staff plt 2
router.get('/ss-staff-plt2', getSSStaffRankHandler);
router.get('/ss-ab-plt2', getSSABPlt2Handler);

router.get('/jarvis/:id', getJarvis);
router.get('/jarvis-staff/:id', getJarvisStaffHandler);
router.get('/jarvis-mech/:id', getJarvisMekanikHandler);

router.get('/ss/:id', getSS);
router.get('/ss-staff/:id', getSSStaffHandler);
router.get('/ss-mech/:id', getSSMekanikHandler);

router.get('/ipeak/:id', getIpeak);
router.get('/ipeak-staff/:id', getIpeakStaffHandler);
router.get('/ipeak-mech/:id', getIpeakMekanikHandler);

router.get('/sap/:id', getSAP);
router.get('/sap-staff/:id', getSAPStaffHandler);
router.get('/sap-mech/:id', getSAPMekanikHandler);

// All data untuk profil user
router.get('/all-data/:id', getAllData);

// Bar Char
router.get('/ss-all-plt2', getSSAcvhPlt2Handler);
router.get('/jarvis-all-plt2', getJarvisAcvhPlt2Handler);
router.get('/ipeak-all-plt2', getIpeakAcvhPlt2Handler);
router.get('/ss-zero-mech-plt2', getAcvhSSMechZeroPlt2Handler);
router.get('/ss-zero-staff-plt2', getAcvhSSStaffZeroPlt2Handler);

// Gauge Char
router.get('/all-kpi', getAllKPIData);

// CRUD Manpower
// Create manpower
router.post('/mp', addManpowerdHandler);
// Get all manpower
router.get('/mp', getAllManpowerHandler);
// Update manpower by NRP
router.put('/mp/:id', updateManpowerByIdHandler);
// Delete manpower by NRP
router.delete('/mp/:id', deleteManpowerByIdHandler);
// Get manpower by NRP
router.get('/mp/:id', getManpowerByIdHandler);

module.exports = router;
