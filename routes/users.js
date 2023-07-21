var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM user', (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});

/* GET user by userId. */
router.get('/:userId', ( req, res) =>{
    const userId = req.params.userId;
    mysql.connection.query('SELECT * FROM user where userId = ?',[userId], (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});



/* POST users */
router.put('/', (req, res) =>{
    const userId = req.body.userId;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const birthDate = req.body.birthDate;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const zipCode = req.body.zipCode;
    const city = req.body.city;
    const region = req.body.region;
    mysql.connection.query('insert into user (userId, email, firstName, lastName, birthDate, phoneNumber, address, zipCode, city, region) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[userId, email, firstName, lastName, birthDate, phoneNumber, address, zipCode, city, region],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).json(result.insertId);
        }
    })
})

router.post('/:id', (req, res) =>{
    const userId = req.body.userId;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const birthDate = req.body.birthDate;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const zipCode = req.body.zipCode;
    const city = req.body.city;
    const region = req.body.region;
    const id=req.params.id;

    const queryUpdateRaw ="UPDATE user SET " + 
    (userId ?`userId = "${userId}"`: "") + (userId?",": "") +
    (email ?` email  = "${email}"`: "") + ((email)?",": "") +
    (firstName ?` firstName = "${firstName}"`: "") + ((firstName)?",": "") +
    (lastName ?` lastName = "${lastName}"`: "") + ((lastName)?",": "") +
    (birthDate ?` birthDate = "${birthDate}"`: "") + ((birthDate)?",": "") + 
    (phoneNumber ?` phoneNumber = "${phoneNumber}"`: "") + ((phoneNumber)?",": "") + 
    (address ?` address = "${address}"`: "") + ((address)?",": "") + 
    (zipCode ?` zipCode = "${zipCode}"`: "") + ((zipCode)?",": "") + 
    (city ?` city = "${city}"`: "") + ((city)?",": "") + 
    (region ?` region = "${region}"`: "");

    const queryUpdate = queryUpdateRaw.substring(0, queryUpdateRaw.length -1);

    mysql.connection.query(queryUpdate + ` where id = ${id};`,(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
})

router.delete('/:id', (req, res) =>{
    const id=req.params.id;
    mysql.connection.query('DELETE FROM user WHERE id = ?',[id],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})


module.exports = router;