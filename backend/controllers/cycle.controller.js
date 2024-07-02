import { cycleModel } from "../models/cycle.model.js";

const addNewCycle=async (req,res,next)=>{
    try{
        const newCycle=req.body;
        const {id,status}=newCycle;
        if(!id || !status){
            return res.status(400).send('Insufficient details');
        }
        const cycle_exist = await cycleModel.findOne({
            $or: [{ id }]
        })
        if(cycle_exist){
            return res.status(401).send({ message: 'Cycle with this id already exist', alert: false });
        }
        const save_status = await cycleModel.create(newCycle);
        return res.status(200).send({ message: 'Cycle added to collection', alert: true });
    }
    catch{
        return res.status(401).send({ data: `${error.message}`, alert: false });
    }
}
const updateStatus= async (req,res,next)=>{
    try {
        const cycleForUpdate=req.body;
        const {id,status}=cycleForUpdate;
        if(!id || !status){
            return res.status(400).send('Insufficient details');
        }
        const updatedCycle= await cycleModel.findOneAndUpdate({id:id},cycleForUpdate);
        if(!updatedCycle){
            return res.status(401).send({
                message:'Enter a valid Id',
                alert:false
            });
        }
        else{
            return res.status(200).send({
                message:"Update Successful",
                alert:true
            });
        }
    } catch (error) {
        return res.status(401).send({ data: `${error.message}`, alert: false });
    }
} 

export {addNewCycle,updateStatus}