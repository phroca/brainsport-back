var express = require('express');
var router = express.Router();
const mysql = require('../models/db');


/* GET users listing. */
router.get('/', (req, res) => {
    mysql.connection.query('SELECT * FROM userplayhistory', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

/* GET users listing. */
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    mysql.connection.query('SELECT * FROM userplayhistory where userId = ?', [userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});



/* POST users */
router.put('/', (req, res) => {
    const userId = req.body.userId;
    const typePlay = req.body.typePlay;
    const time = req.body.time;
    const datePlayed = req.body.datePlayed;
    const errorNumber = req.body.errorNumber;
    mysql.connection.query('insert into userplayhistory (userId, typePlay, time, datePlayed, errorNumber) values(?, ?, ?, ?, ?)', [userId, typePlay, time, datePlayed, errorNumber], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
            return;
        } else {
            res.status(200).json(result.insertId);
        }
    })
})

router.post('/:id', (req, res) => {
    const userId = req.body.userId;
    const typePlay = req.body.typePlay;
    const time = req.body.time;
    const datePlayed = req.body.datePlayed;
    const errorNumber = req.body.errorNumber;
    const id = req.params.id;

    const queryUpdateRaw = "UPDATE userplayhistory SET " +
        (userId ? `userId = "${userId}"` : "") + (userId ? "," : "") +
        (typePlay ? ` time  = "${typePlay}"` : "") + ((typePlay) ? "," : "") +
        (time ? ` time  = "${time}"` : "") + ((time) ? "," : "") +
        (datePlayed ? ` datePlayed = "${datePlayed}"` : "") + ((datePlayed) ? "," : "") +
        (errorNumber ? ` errorNumber = "${errorNumber}"` : "");

    const queryUpdate = queryUpdateRaw.substring(0, queryUpdateRaw.length - 1);

    mysql.connection.query(queryUpdate + ` where id = ${id};`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
            return;
        } else {
            console.log("c'est envoyé");
            res.status(200).json(result);
        }
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    mysql.connection.query('DELETE FROM userplayhistory WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ err: err });
            return;
        } else {
            res.status(200).json(result);
        }
    })

})

module.exports = router;