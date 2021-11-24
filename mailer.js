var nodemailer=require('nodemailer');



var transporter=nodemailer.createTransport({
    service:'gmail',
    port:'587',
    secure:false,
    auth:{
        user: '',
        pass:'',
    }
});

var mailOptions={
    from:'code@gmail.com',
    to:'ram@gmail.com',
    subject:'Sending Email using Nodejs',
    text:'Thank you'
};


transporter.sendMail(mailOptions,function(error,info){
    if(error){
        console.log(error);
    }else{
        console.log('Email sent:' + info.response);
    }
});