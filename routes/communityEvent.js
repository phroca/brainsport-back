var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM communityevent', (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});

/* GET users listing. */
router.get('/:id', ( req, res) =>{
    const id = req.params.userId;
    mysql.connection.query('SELECT * FROM communityevent where id = ?',[id], (err,result) => {
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
    const title = req.body.title;
    const image = req.body.image;
    const periode = req.body.periode;
    const regles = req.body.regles;
    const type = req.body.type;
    const reward = req.body.reward;
    const rewardtitle = req.body.rewardtitle;
    const detail = req.body.detail;
    const objectifLabel = req.body.objectifLabel;
    const objectifData = req.body.objectifData;
    mysql.connection.query('insert into communityevent (title, image, periode, regles, type, reward, rewardtitle, detail, objectifLabel, objectifData) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[title, image, periode, regles, type, reward, rewardtitle, detail, objectifLabel, objectifData],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).json(result.insertId);
        }
    })
})

router.post('/:id', (req, res) =>{
    const title = req.body.title;
    const image = req.body.image;
    const periode = req.body.periode;
    const regles = req.body.regles;
    const type = req.body.type;
    const reward = req.body.reward;
    const rewardtitle = req.body.rewardtitle;
    const detail = req.body.detail;
    const objectifLabel = req.body.objectifLabel;
    const objectifData = req.body.objectifData;
    const id=req.params.id;

    const queryUpdateRaw ="UPDATE communityevent SET " + 
    (title ?`title = "${title}"`: "") + (title?",": "") +
    (image ?`image = "${image}"`: "") + (image?",": "") +
    (periode ?`periode = "${periode}"`: "") + (periode?",": "") +
    (regles ?`regles = "${regles}"`: "") + (regles?",": "") +
    (type ?`type = "${type}"`: "") + (type?",": "") +
    (reward ?`reward = "${reward}"`: "") + (reward?",": "") +
    (rewardtitle ?`rewardtitle = "${rewardtitle}"`: "") + (rewardtitle?",": "") +
    (detail ?`detail = "${detail}"`: "") + (detail?",": "") +
    (objectifLabel ?`objectifLabel = "${objectifLabel}"`: "") + (objectifLabel?",": "") +
    (objectifData ?` objectifData  = "${objectifData}"`: "");

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
    mysql.connection.query('DELETE FROM communityevent WHERE id = ?',[id],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})


module.exports = router;