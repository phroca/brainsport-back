var express = require('express');
var router = express.Router();
const mysql = require('../models/db');


/* GET users listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM userplayhistory', (err,result) => {
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
    const time = req.body.time;
    const datePlayed = req.body.datePlayed;
    const errorNumber = req.body.errorNumber;
    mysql.connection.query('insert into userplayhistory (userId, time, datePlayed, errorNumber) values(?, ?, ?, ?)',[userId, time, datePlayed, errorNumber],(err,result) => {
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
    const time = req.body.time;
    const datePlayed = req.body.datePlayed;
    const errorNumber = req.body.errorNumber;
    const id=req.params.id;

    const queryUpdateRaw ="UPDATE userplayhistory SET " + 
    (userId ?`userId = "${userId}"`: "") + (userId?",": "") +
    (time ?` time  = "${time}"`: "") + ((time)?",": "") +
    (datePlayed ?` datePlayed = "${datePlayed}"`: "") + ((datePlayed)?",": "") +
    (errorNumber ?` errorNumber = "${errorNumber}"`: "");

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
    mysql.connection.query('DELETE FROM userplayhistory WHERE id = ?',[id],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})

module.exports = router;