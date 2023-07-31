var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM userdatacard', (err,result) => {
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
    mysql.connection.query('SELECT * FROM userdatacard where userId = ?',[userId], (err,result) => {
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
    const cards = req.body.cards;
    mysql.connection.query('insert into userdatacard (userId, cards) values(?, ?)',[userId, cards],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).json(result.insertId);
        }
    })
})

router.post('/:userId', (req, res) =>{
    const cards = req.body.cards;
    const userId=req.params.userId;
    mysql.connection.query('UPDATE userdatacard SET cards = ? where userId = ?', [cards, userId],(err,result) =>{
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).json(result);
        }
    })
})

router.delete('/:userId', (req, res) =>{
    const userId=req.params.userId;
    mysql.connection.query('DELETE FROM userdatacard WHERE userId = ?',[userId],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})


module.exports = router;