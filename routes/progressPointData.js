var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM progresspointdata', (err,result) => {
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
    const id = req.params.id;
    mysql.connection.query('SELECT * FROM progresspointdata where id = ?',[id], (err,result) => {
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
    const rewardPointToReach = req.body.rewardPointToReach;
    const levelName = req.body.levelName;
    const imageAvatar = req.body.imageAvatar;
    mysql.connection.query('insert into progresspointdata (rewardPointToReach, levelName, imageAvatar) values(?, ?, ?)',[rewardPointToReach, levelName, imageAvatar],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).json(result.insertId);
        }
    })
})

router.post('/:id', (req, res) =>{
    const rewardPointToReach = req.body.rewardPointToReach;
    const levelName = req.body.levelName;
    const imageAvatar = req.body.imageAvatar;
    const id=req.params.id;

    const queryUpdateRaw ="UPDATE progresspointdata SET " + 
    (rewardPointToReach ?`rewardPointToReach = "${rewardPointToReach}"`: "") + (rewardPointToReach?",": "") +
    (levelName ?`levelName = "${levelName}"`: "") + (levelName?",": "") +
    (imageAvatar ?`imageAvatar = "${imageAvatar}"`: "");

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
    mysql.connection.query('DELETE FROM progresspointdata WHERE id = ?',[id],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})


module.exports = router;