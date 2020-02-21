const mongoose = require('mongoose')
const User = require('../models/user')

const logSchema = mongoose.Schema({
    description: { 
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    foreign: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    }
}, {
    timestamps: true
})

logSchema.methods.insertToLog = async function(model, action, data, owner) {
    const log = this
    const user = await User.findById(owner)
    
    log.description = `${user.name} ${action} ${model}: ${data.description}`
    log.owner = owner
    log.foreign = data._id
    
    await log.save()
}

const Log = mongoose.model('Log', logSchema)

module.exports = Log