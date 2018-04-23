const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltKey = require('../../middlewareAuthChecker/saltKey');

const User = require('../../models/users/users');

router.get('/', (req, res, next) => {

    User.find()
                .select("email password")
                .exec()
                .then(docs => {
                    
                    const response = {
                        count: docs.length,
                        users: docs.map(doc => {
                            return {
                                email: doc.email,
                                password: doc.password,
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
});

router.post('/signup', (req, res, next) => {

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
                        console.log("this point");
                        return res.status(500).json({                  
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    message: 'user is saved successfully'
                                });
                            })
                            .catch(err => {
                                consolr.log("this point 2")
                                res.status(500).json({
                                    error: err
                                });
                            });

                    }
                });

            }
        });
});

router.post('/login', (req, res, next) => {
    
    User.find({email: req.body.email})
        .exec()
        .then( user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, saltKey,
                {
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
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
});

router.delete('/:userId', (req, res, next) => {
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

});

module.exports = router;
