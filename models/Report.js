const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is Required'
  },
  imageUrl: {
    type: String
  },
  patientid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
})
// user_id : {
//   id : {
//       type : mongoose.Schema.Types.ObjectId,
//       ref : 'User'
//   }
// }
const Report = mongoose.model('Report', reportSchema)

module.exports = Report;
