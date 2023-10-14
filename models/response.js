const mongoose = require('mongoose')


const responseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
    res: {
    type: String,
    required: true
  },
  event:{
    type:String,
    required: true
  }
})


module.exports = mongoose.model('Response', responseSchema)
