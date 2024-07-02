import mongoose from "mongoose";

const cycleSchema=mongoose.Schema({
    id : {
        type : String,
        require : true
    },
    status:{
        type : String,
        require : true
    }
},{timestamps : true});

export const cycleModel=mongoose.model('cycles',cycleSchema);