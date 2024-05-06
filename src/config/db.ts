import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log(process.env.MONGOURL,"process.env.MONGOURL");
        
        const conn = await mongoose.connect(process.env.MONGOURL ?? "");
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(error);
        console.log(`MongoDb not connected`);
        process.exit(1);
    }
};

export default connectDB;
