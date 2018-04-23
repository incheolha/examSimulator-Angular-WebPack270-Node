const mongoose = require('mongoose');

const toeflSchema = mongoose.Schema({
    
    registerNo: {type: Number, required: true},              //시험등록 회차    
    registerDesc:{type: String, default:"", required: true}, //시험등록 간단 설명
    registerCreatedDate:{type: Date, 'default': Date.now},   //시험출제 생성일자
    registerCompletionTag:{type: Boolean, default: false}, 
    // yes= 완료, no=미완료
    writer: {type: mongoose.Schema.ObjectId, ref:'User'}, // 선생님 계정 로그인 아이디
       
// reading Schema
    reading : [{
        ExamNO : {type: Number, trim: true, unique:true, required: true}, //시험출제 회차
        ExamDesc:{type: String, required: true}, //시험출제 간단 설명
        ExamCreatedTime:{type:Date, 'default':Date.now}, //시험출제 생성일자
            
        readingParagraph: 
        [{
            readingChapterNumber:{type:Number}, //Chapter Number (1,2,3)
            readingScript :{type:String, required: true}, //Ckeditor
            Problem: [{
                        readingParagraphTitle:{type: String, trim:true, 'default':'', required: true},  //지문의 제목
                        readingParagraphGlossary:{type:String, trim:true, 'default':''}, //어려운 단어 설명
                        readingParagrphImage: {type: String, trim: true, 'default':''}, //지문 관련 이미지
                        readingProblemType:{type:Number, trim:true, 'default':'', required: true}, //문제유형
                        readingProblem:{type:String, trim:true, 'default':'', required: true},  // 시험문제
                        readingSubProblem1:{type:String, trim:true, 'default':''}, //8번유형 문제
                        readingSubProblem2:{type:String, trim:true, 'default':''}, //8,9번 시혐유형 문제
                        readingArticle1:{type:String, trim:true, 'default':''}, // 문제 a번
                        readingArticle2:{type:String, trim:true, 'default':''}, // 문제 b번
                        readingArticle3:{type:String, trim:true, 'default':''}, // 문제 c번
                        readingArticle4:{type:String, trim:true, 'default':''}, // 문제 d번
                        readingArticle5:{type:String, trim:true, 'default':''}, // 문제 e번
                        readingArticle6:{type:String, trim:true, 'default':''}, // 문제 f번
                        readingArticle7:{type:String, trim:true, 'default':''}, // 문제 g번
                        readingAnswer:{type:String, trim:true, 'default':''},  //문제의 정답
                        readingAnswer2:{type:String, trim:true, 'default':''}, //문제 정답2 (8번 또는 9번일때 정답)
                        readingComment:{type:String, trim:true, 'default':''}, // 해설
                        readingProblemAnswer:[
                            { answer: {type:String, trim:true,   'default':''}
                            }]
                    }]
        }]
    }],
//listening Schema
    listening : [{
        ExamNO: {type: Number, trim:true, unique:true, required: true},     	                                  //시험출제 횟차    -시험응시collection과 연결필요
        ExamDesc:{type: String, trim:true, 'default':''},                                                          //시험출제 간단 설명
        ExamCreatedTime:{type: Date, 'default': Date.now},  
                                      //시험출제 생성일자               
        writer: {type: mongoose.Schema.ObjectId, ref:'User'},
    
        listeningParagraph :[{
            // type:[], trim: true, 'default':'',
            listeningChapterNumber:{type:Number, required: true},
            listeningChapterAudio:{type: String, trim:true, 'default':''},
            listeningChapterImage:{type: String, trim:true, 'default':''},
            Problem: [{     
                listeningProblemType: { type: Number, required: true }, // 1~7번 까지의 유형       
                listeningAnnouncementText1: {type: String, trim:true, 'default':''},
                listeningAnnouncementAudio1: {type: String, trim:true, 'default': ''},     //나레이터  멘트  ------ audio 파일이름
                listeningAnnouncementAudio2: {type: String, trim:true, 'default': ''},    // 나레이터  멘트 2 ----- 2개가 필요한 문제의 경우 사용 
                listeningProblemAudio1 : {type: String, trim:true, 'default':''},		  //강의내용 or 대화내용 -- audio 파일 이름
                listeningProblemAudio2: {type: String, trim:true, 'default':''},          //강의내용 or 대화내용 2 -- audio 파일 2개가 필요한 경우 사용
                listeningProblemImage:{type: String, trim: true, 'default':''},		  //강의 or 대화 이미지 -- image 파일 이름
                listeningProblem: {type:String, trim:true, 'default': ''},                // 시험 1번문제
                listeningProblemArticle1 : {type:String, trim:true, 'default':''},         // question 1      
                listeningProblemArticle2 : {type:String, trim:true, 'default':''},         // question 2
                listeningProblemArticle3 : {type:String, trim:true, 'default':''},         // question 3
                listeningProblemArticle4 : {type:String, trim:true, 'default':''},         // question 4
                listeningProblemArticle5 : {type:String, trim:true, 'default':''},
                listeningProblemArticle6 : {type:String, trim:true, 'default':''},
                listeningProblemAnswer:{type:String, trim:true, 'default':''},		  // 정답
                listeningProblemComment:{type:String, trim:true, 'default':''}		  // 해설 
            }]
        }]
    }],
//speaking Schema
    speaking : [{
        ExamNO: {type: Number, unique: true, required: true},     	                      //시험출제 횟차    -시험응시collection과 연결필요
        ExamDesc:{type: String, trim:true, 'default': ''},                                //시험출제 간단 설명
        ExamCreatedTime:{type: Date, 'default': Date.now},                //시험출제 생성일자
        writer: {type: mongoose.Schema.ObjectId, ref:'User'}, 
        // 선생님 계정 로그인 아이디
        //시험 유형
        Problem: 
            [{  
                speakingProblemType: {type: Number, required: true},
                speakingAnnounceImage: {type: String, trim:true, 'default': ''},              // 아나운서 이미지 --- 이미지파일 이름
                speakingAnnouncementAudio: {type: String, trim:true, 'default': ''},          // 아나운서 멘트  ------ audio 파일이름
                speakingProblem: {type: String, 'default':''},                                // 시험  4번문제
                speakingProblemReading: {type: String, trim:true, 'default': ''},             //  시험 4번문제 지문
                speakingProblemListeningImage: {type: String, trim:true, 'default': ''},      //  시험 4번문제 듣기에 삽입할 이미지
                speakingProblemListeningAudio: {type: String, trim:true, 'default': ''},           //  시험 4번문제 듣기
                speakingProblemAnswer: {type: String, trim:true, 'default': ''}               //  시험 4번문제 표준정답 audio파일 
            }]
    }],
//writing Schema
    writing : [{
        ExamNO: {type: Number, trim:true, unique:true, 'default':''},     	//시험출제 횟차    -시험응시collection과 연결필요
        ExamDesc:{type: String, trim:true, 'default':''},                    //시험출제 간단 설명
        ExamCreatedTime:{type: Date, 'default': Date.now},   
        writer: {type: mongoose.Schema.ObjectId, ref:'User'}, 
                // 선생님 계정 로그인 아이디   
            Problem:
                [{             
                    writingProblemType : {type: Number, trim:true} ,  // 독립형인지, 통합형인지 구분  1:통합형 2:독립형
                    writingAnnounceDirection: {type: String, trim: true, 'default': ''}, // 문제출제전 나오는 direction db에서 읽어오기
                    writingAnnouncementAudio: {type: String, trim: true, 'default': ''}, // 디렉션 읽어주는 audio db에서 읽어오기
                    writingProblem: {type: String, trim: true, 'default': ''}, //문제 출제 파트. db에서 읽어오기만 한다.
                    writingProblemReading: {type: String, trim:true, 'default': ''}, //ck editor. 문제에 관련된 스크립트.
                    writingProblemListeningImage: {type: String, trim: true, 'default': ''}, //문제에 관련된 lecture image
                    writingProblemListeningAudio: {type: String, trim: true, 'default': ''}, //문제관련 lecture mp3
                    writingProblemAnswer: {type: String, trim: true, 'default': ''} //선생님이 달아주는 해설파트.
                    
                }]
    }]
});

module.exports = mongoose.model('Toefl', toeflSchema);