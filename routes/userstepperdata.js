var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM userstepperdata', (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});

/* GET users listing. */
router.get('/:userId', ( req, res) =>{
    const userId = req.params.userId;
    mysql.connection.query('SELECT * FROM userstepperdata where userId = ?',[userId], (err,result) => {
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
    const initHomeScreen = req.body.initHomeScreen;
    const initCardAssociation = req.body.initCardAssociation;
    const initPrePlay = req.body.initPrePlay;
    const initPlayGame = req.body.initPlayGame;
    const prePlayHint = req.body.prePlayHint;
    const prePlayData = req.body.prePlayData;
    mysql.connection.query('insert into userstepperdata (userId, initHomeScreen, initCardAssociation, initPrePlay, initPlayGame, prePlayHint, prePlayData) values(?, ?, ?, ?, ?, ?, ?)',[userId, initHomeScreen, initCardAssociation, initPrePlay, initPlayGame, prePlayHint, prePlayData],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).json(result.insertId);
        }
    })
});

router.post('/:id', (req, res) =>{
    const userId = req.body.userId;
    const initHomeScreen = req.body.initHomeScreen;
    const initCardAssociation = req.body.initCardAssociation;
    const initPrePlay = req.body.initPrePlay;
    const initPlayGame = req.body.initPlayGame;
    const prePlayHint = req.body.prePlayHint;
    const prePlayData = req.body.prePlayData;
    const id=req.params.id;

    const queryUpdateRaw ="UPDATE userstepperdata SET " + 
    (userId ?`userId = "${userId}"`: "") + (userId?",": "") +
    (initHomeScreen ?` initHomeScreen  = "${initHomeScreen}"`: "") + ((initHomeScreen)?",": "") +
    (initCardAssociation ?` initCardAssociation = "${initCardAssociation}"`: "") + ((initCardAssociation)?",": "") +
    (initPrePlay ?` initPrePlay = "${initPrePlay}"`: "") + ((initPrePlay)?",": "") +
    (initPlayGame ?` initPlayGame = "${initPlayGame}"`: "") + ((initPlayGame)?",": "") +
    (prePlayHint ?` prePlayHint = "${prePlayHint}"`: "") + ((prePlayHint)?",": "") +
    (prePlayData ?` prePlayData = "${prePlayData}"`: "");

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
});

router.post('/:userId/initHomeScreen', (req, res) =>{
    const userId = req.params.userId;
    const initHomeScreen = req.body.initHomeScreen;

    mysql.connection.query("UPDATE userstepperdata SET initHomeScreen = ? where userId = ?",[initHomeScreen, userId],(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
});
router.post('/:userId/initCardAssociation', (req, res) =>{
    const userId = req.params.userId;
    const initCardAssociation = req.body.initCardAssociation;

    mysql.connection.query("UPDATE userstepperdata SET initCardAssociation = ? where userId = ?",[initCardAssociation, userId],(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
});

router.post('/:userId/initPrePlay', (req, res) =>{
    const userId = req.params.userId;
    const initPrePlay = req.body.initPrePlay;

    mysql.connection.query("UPDATE userstepperdata SET initPrePlay = ? where userId = ?",[initPrePlay, userId],(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
});

router.post('/:userId/initPlayGame', (req, res) =>{
    const userId = req.params.userId;
    const initPlayGame = req.body.initPlayGame;

    mysql.connection.query("UPDATE userstepperdata SET initPlayGame = ? where userId = ?",[initPlayGame, userId],(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
});

router.post('/:userId/prePlayHint', (req, res) =>{
    const userId = req.params.userId;
    const prePlayHint = req.body.prePlayHint;

    mysql.connection.query("UPDATE userstepperdata SET prePlayHint = ? where userId = ?",[prePlayHint, userId],(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
});
router.post('/:userId/prePlayData', (req, res) =>{
    const userId = req.params.userId;
    const prePlayData = req.body.prePlayData;

    mysql.connection.query("UPDATE userstepperdata SET prePlayData = ? where userId = ?",[prePlayData, userId],(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
});

router.delete('/:id', (req, res) =>{
    const id=req.params.id;
    mysql.connection.query('DELETE FROM userstepperdata WHERE id = ?',[id],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})



module.exports = router;