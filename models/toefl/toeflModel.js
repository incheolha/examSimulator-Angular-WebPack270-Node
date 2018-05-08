const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../users/userModel');

const toeflSchema = new Schema({
    
    toeflNo: {type: Number, required: true},              //시험등록 회차    
    toeflDesc:{type: String, default:" "},                //시험등록 간단 설명
    toeflCreatedDate:{type: Date, 'default': Date.now},   //시험출제 생성일자
    toeflCompletionTag:{type: Boolean, default: false},   // yes= 완료, no=미완료
    toeflImage:{type: String, required: false},           //toefl Main Card Image
    toeflAudio:{type: String, required: false },
    writer: {type: Schema.Types.ObjectId, ref:'User'}, // 선생님 계정 로그인 아이디
    reading: { type: Schema.Types.ObjectId, ref: "Reading"}, 
    listening: { type: Schema.Types.ObjectId, ref: "Listening"}, 
    speaking: { type: Schema.Types.ObjectId, ref: "Speaking"},
    writing: { type: Schema.Types.ObjectId, ref: "Writing"}
});

toeflSchema.post('remove', (toefl) => {
    console.log(toefl.writer);
    User.findById(toefl.writer, (err, user) => {
        user.toeflId.pull(toefl);
        user.save();
    });
});

module.exports = mongoose.model('Toefl', toeflSchema);