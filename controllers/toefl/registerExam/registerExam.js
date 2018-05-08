const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Toefl = require('../../../models/toefl/toeflModel');
const User = require('../../../models/users/userModel');

exports.register_get_all = (req, res, next) => {

    //token 속에 들어있는 payload 값인 user doc에 관한 내용을 decoded하는과정
    const decoded = jwt.decode(req.query.token);
    console.log("decoded: " + decoded.user.permissionTag);
    console.log("decoded: " + decoded.user.email);

    if (decoded.user.permissionTag == 'teacher') {
        Toefl.find()
                    .populate('writer', 'name email permissionTag')
                    .sort({'toeflNo': -1})                           // 내림차순 sorting 구문
                    .exec()
                    .then(docs => {  
                        const response = {
                            count: docs.length,
                            toefl: docs.map(doc => {
                                return {
                                    _id: doc._id,
                                    toeflNo: doc.toeflNo,
                                    toeflDesc: doc.toeflDesc,
                                    toeflCreatedDate: doc.toeflCreatedDate,
                                    toeflCompletionTag: doc.toeflCompletionTag,
                                    toeflImage: doc.toeflImage
                                
                                };
                            })
                        };

                        console.log(docs);
                        res.status(200).json({
                            message: 'get successfully',
                            obj: docs
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
    } else {
        return res.status(401).json({
            message: 'permission denied',
            error: {meesage:'permission denied'}
        });
    }
        
  
};

//토플시험 등록 신청시 반드시 parameters로 toeflNo를 가지고 들어오기
exports.register_create = (req, res, next) => {
    console.log(req.files);

    //token 속에 들어있는 payload 값인 user doc에 관한 내용을 decoded하는과정
    const decoded = jwt.decode(req.query.token);
    console.log("decoded: " + decoded.user.email);

    //만일 req.file이 없으면 dqfault.png로 설정하는 과정
    if (req.files == null) {
        temp_image_path = 'routes/toefl/registerExam/uploads/default.png';
        temp_audio_path = 'routes/toefl/registerExam/uploads/default.mp3';
    
    } else {

        for (let i = 0; i < req.files.length; i++) {
    
            if (req.files[i].mimetype === 'image/png' ||
                       req.files[i].mimetype === 'image/jpeg' ||
                       req.files[i].mimetype === 'image/jpg' ||
                       req.files[i].mimetype === 'image/gif' ) 
                       {
                        temp_image_path = req.files[i].path;
            } else if (req.files[i].mimetype === 'audio/mp3' ||
                       req.files[i].mimetype === 'audio/mpeg' ||
                       req.files[i].mimetype === 'audio/wav' ||
                       req.files[i].mimetype === 'audio/swf' ) 
                        {
                        temp_audio_path = req.files[i].path;
                }
        }
    }
    

    User.findById(decoded.user._id, (err, user) => {
        if (err) {
            return res.status(500).json({
                title: "The User is not exisred",
                error: err
            });
        } else {

            Toefl.findOne({ toeflNo: req.params.toeflNo }) 
            .exec()
            .then( toeflDoc => {
                if (toeflDoc) {
                    return res.status(409).json({
                        message: 'Toefl No. is already exists'
                    });
                } else {
                    const toefl = new Toefl({
                        toeflNo: req.params.toeflNo,
                        toeflDesc: req.body.toeflDesc,
                        toeflImage: temp_image_path,
                        toeflAudio: temp_audio_path,
                        writer: user._id
                    });
                    toefl
                        .save()
                        .then(result => {
                            console.log(result);
                            user.toeflId.push(result.toObject());  //toefl이 정상적으로 save가 되면 user doc에 toeflId를 저장하는구문
                            user.save();
                            res.status(200).json({
                                message: 'Toefl Registration is saved successfully'
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });      

        }
    });
    
};

exports.register_update = (req, res, next) => {
    console.log(req.files);
    //token 속에 들어있는 payload 값인 user doc에 관한 내용을 decoded하는과정
    const decoded = jwt.decode(req.query.token);
    console.log("decoded: " + decoded.user.email);
    console.log('update description :' + req.body.toeflDesc);
    const upateToeflDesc = req.body.toeflDesc;
    
    const id = req.params.toeflNo;
    updateOperation = {};

    //만일 req.file이 없으면 dqfault.png로 설정하는 과정
    if (req.files == null) {
        temp_image_path = 'routes/toefl/registerExam/uploads/default.png';
        temp_audio_path = 'routes/toefl/registerExam/uploads/default.mp3';
    
    } else {

        for (let i = 0; i < req.files.length; i++) {
    
            if (req.files[i].mimetype === 'image/png' ||
                req.files[i].mimetype === 'image/jpeg' ||
                req.files[i].mimetype === 'image/jpg' ||
                req.files[i].mimetype === 'image/gif' ) 
                {
                temp_image_path = req.files[i].path;
            } else if (req.files[i].mimetype === 'audio/mp3' ||
                       req.files[i].mimetype === 'audio/wav' ||
                       req.files[i].mimetype === 'audio/ogg' ) 
                        {
                        temp_audio_path = req.files[i].path;
                }
        }
    }
 
        updateOperation = {
            toeflDesc: req.body.toeflDesc,
            toeflImage: temp_image_path,
            toeflAudio: temp_audio_path
        };
        
        Toefl.update({toeflNo : id }, { $set: updateOperation })
             .exec()
             .then(result => {
                 console.log(result);
                 res.status(200).json({
                     message: 'Toefl Updated',
                 });
             })
             .catch(err => {
                 console.log(err);
                 res.status(500).json({
                     error: err
                 });
             });   
};

exports.register_delete = (req, res, next) => {
    const toeflId = req.params.toeflId;
   const decoded = jwt.decode(req.query.token);

   Toefl.findById(req.params.toeflId, (err, toefl) => {
       if (err) {
           return res.status(500).json({
               title: 'Toefl Id can not be founded',
               error: err
           });
       }
       if (!toefl) {
           return res.status(500).json({
               title: 'No Toefl found',
               error: { message: 'Toefl is not founded'}
           });
       }
       if (toefl.writer != decoded.user._id) {
           return res.status(401).json({
            title: 'Not Authenticated',
           error: { message: 'User is not matched'}
           });
       }
       toefl.remove((err, result) => {
           if (err) {
               return res.status(500).json({
                   title: 'error occurred',
                   error: err
               });
           }
           console.log(result);
           res.status(200).json({
               message: 'deleted Toefl Exam',
               obj: result
           });
       });
   });
};