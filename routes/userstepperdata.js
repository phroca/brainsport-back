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



/* POST users */
router.put('/', (req, res) =>{
    const userId = req.body.userId;
    const initHomeScreen = req.body.initHomeScreen;
    const initCardAssociation = req.body.initCardAssociation;
    const initPrePlay = req.body.initPrePlay;
    const initPlayGame = req.body.initPlayGame;
    mysql.connection.query('insert into userstepperdata (userId, initHomeScreen, initCardAssociation, initPrePlay, initPlayGame) values(?, ?, ?, ?, ?)',[userId, initHomeScreen, initCardAssociation, initPrePlay, initPlayGame],(err,result) => {
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
    const initHomeScreen = req.body.initHomeScreen;
    const initCardAssociation = req.body.initCardAssociation;
    const initPrePlay = req.body.initPrePlay;
    const initPlayGame = req.body.initPlayGame;
    const id=req.params.id;

    const queryUpdateRaw ="UPDATE userstepperdata SET " + 
    (userId ?`userId = "${userId}"`: "") + (userId?",": "") +
    (initHomeScreen ?` initHomeScreen  = "${initHomeScreen}"`: "") + ((initHomeScreen)?",": "") +
    (initCardAssociation ?` initCardAssociation = "${initCardAssociation}"`: "") + ((initCardAssociation)?",": "") +
    (initPrePlay ?` initPrePlay = "${initPrePlay}"`: "") + ((initPrePlay)?",": "") +
    (initPlayGame ?` initPlayGame = "${initPlayGame}"`: "");

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