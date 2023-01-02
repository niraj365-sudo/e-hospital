const mongoose = require('mongoose')

const RegNumSchema = new mongoose.Schema({
    regnum_patient: {
        type: String,
        required: true
    }
});

const RegNum = mongoose.model('RegNum', RegNumSchema);

module.exports = RegNum;