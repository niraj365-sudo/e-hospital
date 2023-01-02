
const mongoose = require('mongoose')

const adminreportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is Required'
    },
    imageUrl: {
        type: String
    },
    toPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
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
const AdminReport = mongoose.model('AdminReport', adminreportSchema)

module.exports = AdminReport;
