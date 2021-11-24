const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const User=require('./model/user.model')
const nodemailer=require('nodemailer');
const EmailOtp=require('./model/emailcode.model');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/p2pdb')

app.use(cors())
app.use(express.json())

app.get('/hello',(req,res)=>{
    res.send('hello world')
})


app.post('/api/register',async (req,res)=>{
    console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            nickname: req.body.nickname,
            invitecode: req.body.invitecode,
            country: req.body.country,
            email: req.body.email,
            phone:req.body.phone,
            password:newPassword,
        })
        res.json({status:'ok'})
    } catch (err) {
        console.log(err)
        res.json({status:'Error',error:'Duplicate email'})
    }
})




var transporter=nodemailer.createTransport({
    service:'smtp.gmail.com',
    port:'465',
    secure:true,
    service:'gmail',
    auth:{
        user: 'blockstars2021@gmail.com',
        pass:'48044804',
    }
});



app.post('/api/emailotp',async (req,res)=>{
    console.log(req.body)
    // let data = await User.findOne({email:req.body.email});
    let data = {email:req.body.email}
    if(data){
        let otpCode = Math.floor((Math.random()*10000)+1);
        let otpData=new EmailOtp({
            email:req.body.email,
            code:otpCode,
            expireIn: new Date().getTime() + 300*1000
        })
        let otpResponse = await otpData.save();
        var mailOptions = {
            from:"blockstars2021@gmail.com",
            to: req.body.email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otpCode + "</h1>"
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            res.render('otp');
        });
        res.json({status:'Otp Sent'});
    }
    else{
        console.log(err)
        res.json({status:'Error',error:'Something went wrong'})
    }
})


app.post('/api/emailverify', async (req,res)=>{
    const data = await EmailOtp.findOne({code:req.body.code})
    if(!data){ return res.json({status:"Invalid Otp",data:false}) }
    // console.log(data.code);
    if(data)
    {
        if(data.code == req.body.code){
            res.json({status:'Valid Otp',data:true})
        }
        // let currentTime = new Date().getTime();
        // let diff = data.expireIn - currentTime;
        // console.log(diff);
        // if(diff < 0){
        //     return res.json({status:'Correct Otp'})
        // }else{
        //     return res.json({status:'Incorrect Otp'})
        // }
        // return res.json({status:'Correct Otp'})
    }

})

















app.post('/api/reset_password',async(req,res)=>{
    let data=await Otp.find({email:req.body.email,code:req.body.code})
    if(data){
        let currentTime=new Date().getTime;
        let diff = data.expiresIn - currentTime;
        if(diff < 0){
            res.json({status:'Otp Expired'})
        }else{
            let user=await User.findOne({email:req.body.email})
            user.password = req.body.password;
            user.save();
            res.json({status:'Password changed sucessfully'})
        }
    }else{
        res.json({status:'Invalid Otp'})
    }
})



app.post('/api/login',async (req,res)=>{
    console.log(req.body)
        const user = await User.findOne({
            email: req.body.email
        })

        if(!user) { return {status:'Invalid user'} }

        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password)

        if(isPasswordValid){

            const token = jwt.sign(
            {
                name: user.nickname,
                email: user.email,
            }, 
            'supersecret123'
            )

            return res.json({status:'ok',user:token})
            console.log(user)
        }else{
            return res.json({status:'error',user:false})
            console.log(user)
        }
})

app.listen(1337,()=>{
    console.log('Server running on port 1337')
})