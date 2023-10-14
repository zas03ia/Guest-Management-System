const express = require('express')
const mongoose = require('mongoose')
const Guest = require('./models/guest')
const Response = require('./models/response')
const app = express()


mongoose.connect('mongodb://127.0.0.1/GuestManagement', {
  useNewUrlParser: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(hostname, eventname, email, guestname, date, id) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'isabella8@ethereal.email', // generated ethereal user
      pass: 'DJQnBQSFpS1v2fMr1f' // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `Event Planning Agent, isabella8@ethereal.email`, // sender address
    to: `${email}`, // list of receivers
    subject: `Inviation to ${eventname} event!`, // Subject line
    text: '', // plain text body
    html: `<p>Dear Guest <strong>${guestname}</strong>, <strong>${hostname}</strong> cordially invites you to <strong>${eventname}</strong> which is to take place on <strong>${date}</strong>.</p>
    <p>Kindly provide a response of your arrival! </p>
    <p><a href='http://localhost:5000/email1/${guestname}-${id}' class='btn btn-info' >Yes</a></p>
    <p><a href='http://localhost:5000/email2${guestname}-${id}' class='btn btn-info'>No</a></p>
    <p><a href='http://localhost:5000/email3${guestname}-${id}' class='btn btn-info'>Not sure</a></p>
    
    `, // html body

  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



app.get('/', async (req, res) => {

    res.render('index')
})

app.get('/guest', (req, res) => {

    var date = new Date();
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });
    var formattedDate = year + "-" + month + "-" + day;
    res.render('guest', {cdate:formattedDate})
})


app.get('/info', async (req, res) => {
   var Number= req.query.Number

  
   const entry = new Guest({
    number: req.query.Number,
    date : req.query.date,
    hostname: req.query.hname,
    eventname:req.query.ename
  })
  
    const lastentry= await entry.save()
    
    
    res.render('guest_info', {Number:Number, eid:lastentry.id})
 
    
}) 

app.post('/confirm', async (req, res) => {
  let number= req.body.Number
  let id= req.body.eid
  var n
  var em

  for (let i =1; i <= number;  i++ ){
   
    n= "name" +i;
    var name= req.body[n];
    em= "email"+i;
    let email= req.body[em];
    const entry= await Guest.findOne({_id:id},{hostname:1, eventname:1, date:1})  
    main(entry.hostname, entry.eventname, email, name, entry.date, entry.id).catch(console.error);
  }
    res.render('confirmation')
})


app.post('/guest_res', async (req, res) => {
    let id= req.body.res
    const ey= await Response.find({event:id.toString(), res:"yes"})  
    const en= await Response.find({event:id.toString(), res:"no"})  
    const ens= await Response.find({event:id.toString(), res:"notSure"})  

    res.render('guest_res',{yes:ey, no:en, notsure:ens})

})

app.get('/choose', async (req, res) => {
  const entry= await Guest.find({},{_id:1, eventname:1})  
    res.render('choose',{events:entry})

})



app.get('/email1/:id', async (req, res) => {
    const param = req.params.id.split("-")
    let name = param[0]
    let id= param[1]
    try {
      await Response.deleteOne({name: name});
      
      const entry = new Response({
        name: param[0],
        res : "yes",
        event: id.toString()
      })
      
      const lastentry= await entry.save()
      res.render('response')
    }
    catch(err) {
      const entry = new Response({
        name: param[0],
        res : "yes",
        event: id.toString()
      })
      
      const lastentry= await entry.save()
      res.render('response')
    }
    
})
app.get('/email2:id', async (req, res) => {
  const param = req.params.id.split("-")
  let name = param[0]
  let id= param[1]
  try {
    await Response.deleteOne({name: name});
    
    const entry = new Response({
      name: param[0],
      res : "no",
      event: id.toString()
    })
    
    const lastentry= await entry.save()
    res.render('response')
  }
  catch(err) {
    const entry = new Response({
      name: param[0],
      res : "no",
      event: id.toString()
    })
    
    const lastentry= await entry.save()
    res.render('response')
  }
})
app.get('/email3:id', async (req, res) => {
  const param = req.params.id.split("-")
  let name = param[0]
  let id= param[1]
  try {
    await Response.deleteOne({name: name});
    
    const entry = new Response({
      name: param[0],
      res : "notSure",
      event: id.toString()
    })
    
    const lastentry= await entry.save()
    res.render('response')
  }
  catch(err) {
    const entry = new Response({
      name: param[0],
      res : "notSure",
      event: id.toString()
    })
    
    const lastentry= await entry.save()
    res.render('response')
  }
})
app.listen(5000)