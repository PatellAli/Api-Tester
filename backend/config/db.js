import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log("CONNECTED to mondoDB: ", conn.connection.host);
        
    } catch (error) {
        console.log(`ERROR: ${error}`);
        process.exit(1)       
    }
}