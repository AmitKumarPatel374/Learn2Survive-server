const mongoose = require("mongoose");

const connectDB = async()=>{
    try {
        const res = await mongoose.connect(process.env.MONGO_URI);
        if (res) {
            console.log("mongoDB connected successfully!");
        }
    } catch (error) {
        console.log("error occured while connecting database");
        
    }
}

module.exports=connectDB;