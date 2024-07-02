import { bookingModel } from "../models/booking.model.js";
import { cycleModel } from "../models/cycle.model.js";

async function findIntersectingBookings(startTime, endTime,date) {
  try {
    const results = await bookingModel.aggregate([
      {
        $match: {
          $and:[{
            Date: date
          },
          {
              $or: [
            { startTime: { $lt: endTime, $gt: startTime } },
            { endTime: { $gt: startTime, $lt: endTime } },
            { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
            ]
          }
          ]
        }
      },
      {
        $group: {
          _id: '$cycleId',
          bookings: { $push: '$$ROOT' }
        }
      }
    ]);
    return results;
  } catch (err) {
    throw err;
  }
}

const findAvailableCycle=async (req,res,next) =>{
  try {
    const data=req.body
    const {startTime,endTime,date} = data;

    const bookingExist=await bookingModel.findOne({
      rollno : data.rollno,
      status : false
    });
    if(bookingExist){
      return res.status(400).send({
        message:"Only one booking allowed per user",
        alert:false
      })
    }
    
    const workingCycles = await cycleModel.find({ status: 'Working' }).exec();
    const workingCycleIds = workingCycles.map(cycle => cycle._id);
    const intersectingBookings = await findIntersectingBookings(startTime, endTime,date);
    const bookedCycleIds = intersectingBookings.map(booking => booking._id);
    const availableCycleId = workingCycleIds.find(cycleId => !bookedCycleIds.includes(cycleId.toString()));
    
    if (availableCycleId) {
      const cyc=await cycleModel.findById(availableCycleId._id);
      const newBooking={
        name:data.name,
        rollno:data.rollno,
        phoneno:data.phoneno,
        startTime:startTime,
        endTime:endTime,
        Date:data.date,
        cycleId:cyc.id,
        status:"false"
      }
      const result=await bookingModel.create(newBooking);

      return res.status(200).send({
        message:"Booking Successful",
        alert:true
      });
    } else {
      return res.status(400).send({
        message:"No Cycles available for this booking",
        alert:false
      });
    }
  } catch (err) {
    res.send({
      message:`${err.message}`,
      alert:false
    })
  }
}

const bookingissue=async (req,res,next)=>{
  try {
    const booking=req.body;
    await bookingModel.findByIdAndUpdate(booking._id,
      {
          $set: {
              status: "true"
          }
      },
      {
          new: true
      }
  );
  return res.status(200).send({message : "Cycle Issued",alert : true})
  } catch (error) {
    return res.status(400).send({message : `${error.message}`,alert : false})
  }
}


const bookingdone=async (req,res,next)=>{
  try {
    const booking=req.body;
    await bookingModel.findByIdAndDelete(booking._id)
  return res.status(200).send({message : "Cycle Received",alert : true})
  } catch (error) {
    return res.status(400).send({message : `${error.message}`,alert : false})
  }
}



export {findAvailableCycle,bookingdone,bookingissue};