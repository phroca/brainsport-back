var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM userfamillyprogress', (err,result) => {
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
    mysql.connection.query('SELECT * FROM userfamillyprogress where userId = ?',[userId], (err,result) => {
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
    const famillyProgress = req.body.famillyProgress;
    mysql.connection.query(`insert into userfamillyprogress (userId, famillyProgress) values("${userId}", "${famillyProgress}")`, (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).json(result.insertId);
        }
    })
})

router.post('/:userId', (req, res) =>{
    const userId = req.params.userId;
    const famillyProgress = req.body.famillyProgress;

    mysql.connection.query("UPDATE userfamillyprogress SET famillyProgress  = ? where userId = ?", [famillyProgress, userId],(err,result) =>{
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
    mysql.connection.query('DELETE FROM userfamillyprogress WHERE id = ?',[id],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})


module.exports = router;