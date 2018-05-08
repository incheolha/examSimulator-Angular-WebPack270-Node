
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    email: { type: String, 
            required: true,
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
            
    password: { type: String, required: true},
    name: {type: String, required: true},
    permissionTag: {type: String},
    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
    updated_at: {type: Date, index: {unique: false}, 'default': Date.now},
    provider: {type: String, 'default':''},
    authToken: {type: String, 'default':''},
    facebook: {},
    google: {},
    toeflId: [{ type: mongoose.Schema.ObjectId, ref: 'Toefl'}]              //토플시험출제연결 ID  
});

module.exports = mongoose.model('User', userSchema);