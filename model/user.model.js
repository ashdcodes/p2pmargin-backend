const mongoose=require('mongoose')

const User = new mongoose.Schema(
    {
        nickname:{type:String,required:true},
        invitecode:{type:String,required:true},
        country:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        phone:{type:Number,required:true},
        password:{type:String,required:true},

    },
    {collection: 'userdata'}
)

const model=mongoose.model('UserData',User)

module.exports = model