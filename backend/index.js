
import { configDotenv } from 'dotenv';
configDotenv();
import connectDB from './db/connectDB.js';
import app from './app.js';

connectDB()
.then((error) => {
    app.on('error',(error)=>{
        console.log(`Server Not working ->`+`${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    })
})
.catch((err) => {
    console.log("Hi");
    console.log(err.message);
    console.log("Something went wrong");
});