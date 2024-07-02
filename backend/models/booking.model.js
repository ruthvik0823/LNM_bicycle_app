import mongoose from "mongoose";
const bookingSchema=mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    rollno:{
        type : String,
        require : true
    },
    phoneno:{
        type:Number,
        require:true
    },
    startTime:{
        type : String,
        require :true
    },
    endTime:{
        type : String,
        require :true
    },
    Date:{
        type : String,
        require :true
    },
    cycleId:{
        type : String,
        require :true
    },
    status:{
        type:String,
        require:true
    }
},{timestamps : true});

export const bookingModel=mongoose.model('bookings',bookingSchema);