const mongoose=require("mongoose")


const EmailOtp = new mongoose.Schema(
    {
        email:{type:String},
        code:{type:String},
        expireIn:{type:Number},
    },
    {
        timestamps:true
    }
)


const emailotpmodel=mongoose.model('EmailOtp',EmailOtp,);

module.exports=emailotpmodel