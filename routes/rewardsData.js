var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', (req, res) => {
    mysql.connection.query('SELECT * FROM rewardsdata', (err, result) => {
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
router.get('/:id', (req, res) => {
    const id = req.params.id;
    mysql.connection.query('SELECT * FROM rewardsdata where id = ?', [id], (err, result) => {
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
    const type = req.body.type;
    const points = req.body.points;
    mysql.connection.query('insert into rewardsdata (type, points) values(?, ?, )', [type, points], (err, result) => {
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
    const type = req.body.type;
    const points = req.body.points;
    const id = req.params.id;

    const queryUpdateRaw = "UPDATE rewardsdata SET " +
        (type ? `type = ${type}` : "") + (type ? "," : "") +
        (points ? `points = ${points} ` : "");

    const queryUpdate = queryUpdateRaw.substring(0, queryUpdateRaw.length - 1);

    mysql.connection.query(queryUpdate + ` where id = ${id};`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
            return;
        } else {
            res.status(200).json(result);
        }
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    mysql.connection.query('DELETE FROM rewardsdata WHERE id = ?', [id], (err, result) => {
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