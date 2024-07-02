import mongoose from "mongoose";
const connectDB=async ()=>{
    try {
        mongoose.set('strictQuery',false);
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("MongoDB connection established");
    } catch (error) {
        console.log("MongoDB connection failed");
        return error;
    }
}

export default connectDB;