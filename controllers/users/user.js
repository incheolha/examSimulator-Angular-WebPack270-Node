const mongoose = require('mongoose');
const User = require('../../models/users/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltKey = require('../../middlewareAuthChecker/saltKey');

exports.user_get_all = (req, res, next) => {

    User.find()
                .select()
                .exec()
                .then(docs => {
                    
                    const response = {
                        count: docs.length,
                        users: docs.map(doc => {
                            return {
                                email: doc.email,
                                password: doc.password,
                                name: doc.name,
                                permissionTag: doc.permissionTag,
                                created_at: doc.created_at,
                                updated_at: doc.updated_at,
                                provider: doc.provider,
                                _id: doc._id,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/user/' + doc._id
                                }
                            };
                        })
                    };
                    console.log(response);
                    res.status(200).json(response);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                });
};

exports.user_signUp = (req, res, next) => {

    User.find({ email: req.body.email }) 
        .exec()
        .then( user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email is already exists'
                });
            } else {
                console.log(req.body.password);

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                       
                        return res.status(500).json({                  
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            permissionTag: req.body.permissionTag
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    message: 'user is saved successfully'
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

exports.user_login = (req, res, next) => {

    

    User.findOne({email: req.body.email})
        .exec()
        .then( user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'login  failed'
                });
            }
            if (result) {
                const token = jwt.sign({user: user}, saltKey,{expiresIn: '1h'});
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token,
                    userId: user._id
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        });

    })
    .catch(err => {
       
        res.status(500).json({
            error: err
        });
    });
};

exports.user_delete = (req, res, next) => {
    const id = req.params.userId;

    User.remove({_id:id})
                            .exec()
                            .then(result => {
                                res.status(200).json(
                                    {
                                        message: 'User deleted'
                                    }
                                );
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
};
