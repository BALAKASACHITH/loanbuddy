const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    email:String,
    otp:Number,
    createdAt: { type: Date, default: Date.now, expires: 300 },
});
const Otp=mongoose.model("Otp",schema);
module.exports=Otp;