const mongoose = require('mongoose')


const guestSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  number:{
    type: Number,
    min:1
  },
  eventname: {
    type: String,
    required: true
  },
  hostname: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('Guest', guestSchema)
