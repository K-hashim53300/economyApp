import mongoose from 'mongoose';

const connection = async()=>{
    return await mongoose.connect(process.env.DB_URI).then(
        ()=>{
            console.log("Database connected successfully");
        }
    ).catch((error)=>{
        console.log("Error in connection",error);
    })
}
export default connection;

/*
final headers = {
  'Authorization': 'Bearer your-jwt-token',
  'Content-Type': 'application/json',
};

*/