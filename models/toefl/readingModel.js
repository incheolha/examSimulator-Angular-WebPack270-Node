
var mongoose = require('mongoose');

var readingSchema = new mongoose.Schema({
    ExamNO : {type: Number, trim: true, 'default':''},                  //시험출제 회차
    ExamDesc:{type: String, trim: true, 'default':''},                  //시험출제 간단 설명
    ExamCreatedTime:{type:Date, 'default':Date.now},                    //시험출제 생성일자
    toeflNo: {type: mongoose.Schema.ObjectId, ref:'Toefl'},             // Main Toefl Doc 연결
    readingParagraph: 
        [{
        readingChapterNumber:{type:Number},             //Chapter Number (1,2,3)
        readingScript :{type:String, trim:true, 'default':''}, //Ckeditor
        Problem: [{
            readingParagraphTitle:{type: String, trim:true, 'default':''},  
            //지문의 제목
            readingParagraphGlossary:{type:String, trim:true, 'default':''}, 
            //어려운 단어 설명
            readingParagrphImage: {type: String, trim: true, 'default':''}, 
            //지문 관련 이미지
            readingProblemType:{type:Number, trim:true, 'default':''}, //문제유형
            readingProblem:{type:String, trim:true, 'default':''},  // 시험문제
            readingSubProblem1:{type:String, trim:true, 'default':''}, //8번유형 문제
            readingSubProblem2:{type:String, trim:true, 'default':''}, 
            //8,9번 시혐유형 문제
            readingArticle1:{type:String, trim:true, 'default':''}, // 문제 a번
            readingArticle2:{type:String, trim:true, 'default':''}, // 문제 b번
            readingArticle3:{type:String, trim:true, 'default':''}, // 문제 c번
            readingArticle4:{type:String, trim:true, 'default':''}, // 문제 d번
            readingArticle5:{type:String, trim:true, 'default':''}, // 문제 e번
            readingArticle6:{type:String, trim:true, 'default':''}, // 문제 f번
            readingArticle7:{type:String, trim:true, 'default':''}, // 문제 g번
            readingAnswer:{type:String, trim:true, 'default':''},  //문제의 정답
            readingAnswer2:{type:String, trim:true, 'default':''}, 
            //문제 정답2 (8번 또는 9번일때 정답)
            readingComment:{type:String, trim:true, 'default':''}, // 해설
            readingProblemAnswer:{type:[], trim:true, 'default':''}
            }]
        }]    
});

module.exports = mongoose.model('Reading', readingSchema);