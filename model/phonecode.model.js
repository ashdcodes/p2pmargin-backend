const mongoose=require("mongoose")


const PhoneOtp = new mongoose.Schema(
    {
        phone:{type:Number},
        code:{type:String},
        expiresIn:{type:Number}
    },
    {
        timestamps:true
    }
)


const phoneotpmodel=mongoose.model('PhoneOtp',PhoneOtp,);

module.exports=phoneotpmodel