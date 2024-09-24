const {getAllManpower, getManpowerById, updateManpowerById, deleteManpowerById, addManpower} = require('../models/manpowerModel');

async function getAllManpowerHandler(req, res){
    try{
        const manpower = await getAllManpower();
        res.status(200).json(manpower);
        }catch(err){
            res.status(500).json({message: err.message});
        }
}

async function getManpowerByIdHandler(req, res){
    const nrp = req.params.id; 
    try{
        const manpower = await getManpowerById(nrp);
        res.status(200).json(manpower);
        }catch(err){
            res.status(400).json({message: err.message});
        }
}

async function updateManpowerByIdHandler(req, res){
    let nrp = req.param.id;
    const data  = req.body;
    try{
        const manpower = await updateManpowerById(data, nrp);
        res.status(200).json(manpower);
        }catch(err){
            res.status(500).json({message: err.message});
        }
}

async function deleteManpowerByIdHandler(req, res){
    let nrp = req.param.id;
    try{
        const manpower = await deleteManpowerById(nrp);
        res.status(200).json(manpower);
        }catch(err){
            res.status(400).json({message: err.message});
        }
}

async function addManpowerdHandler(req, res){
    const data  = req.body; //console.log(req.body);
    try{
        const manpower = await addManpower(data);
        res.status(200).json(manpower);
        }catch(err){
            res.status(500).json({message: err.message});
        }
}

module.exports = {
    getAllManpowerHandler,
    getManpowerByIdHandler,
    updateManpowerByIdHandler,
    deleteManpowerByIdHandler,
    addManpowerdHandler,
  };
  
