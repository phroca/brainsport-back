var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', (req, res) => {
    mysql.connection.query('SELECT * FROM userfriends', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

/* GET users listing with state. */
router.get('/:userId/state/:state', (req, res) => {
    const userId = req.params.userId;
    const state = req.params.state;
    mysql.connection.query('SELECT uf.userId, uf.userFriendId, uf.state, u.firstName, u.lastName, u.colorProfil, u.rewardPoints, u.bio, u.region FROM userfriends uf LEFT JOIN user u ON u.userId = uf.userFriendId where uf.userId = ? and uf.state = ?', [userId, state], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

/* GET users listing from friend with state. */
router.get('/addedUser/:userFriendId/state/:state', (req, res) => {
    const userFriendId = req.params.userFriendId;
    const state = req.params.state;
    mysql.connection.query('SELECT uf.userId, uf.userFriendId, uf.state, u.firstName, u.lastName, u.colorProfil, u.rewardPoints, u.bio, u.region FROM userfriends uf LEFT JOIN user u ON u.userId = uf.userId where uf.userFriendId = ? and uf.state = ?', [userFriendId, state], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

/* GET VERIFY If userFriend is friend of user. */
router.get('/:userId/verify/:userFriendId', (req, res) => {
    const userId = req.params.userId;
    const userFriendId = req.params.userFriendId;
    mysql.connection.query('SELECT uf.userId, uf.userFriendId, uf.state, u.firstName, u.lastName, u.colorProfil, u.rewardPoints, u.bio, u.region FROM userfriends uf LEFT JOIN user u ON u.userId = uf.userFriendId where uf.userId = ? and uf.userFriendId = ?', [userId, userFriendId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});
/* GET VERIFY If userFriend is waiting to be validated by the current user. */
router.get('/addedUser/:userId/verify/:userFriendId', (req, res) => {
    const userId = req.params.userId;
    const userFriendId = req.params.userFriendId;
    mysql.connection.query('SELECT uf.id as friendLineId, uf.userId, uf.userFriendId, uf.state, u.firstName, u.lastName, u.colorProfil, u.rewardPoints, u.bio, u.region FROM userfriends uf LEFT JOIN user u ON u.userId = uf.userId where uf.userFriendId = ? and uf.userId = ?', [userId, userFriendId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});



/* PUT users add friend request */
router.put('/:userId/add/:userFriendId', (req, res) => {
    const userId = req.params.userId;
    const userFriendId = req.params.userFriendId;
    mysql.connection.query('insert into userfriends (userId, userFriendId, state) values(?, ?, ?)', [userId, userFriendId, "WAITING"], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
            return;
        } else {
            res.status(200).json(result.insertId);
        }
    })
})


router.post('/byId/:id', (req, res) => {
    const userId = req.body.userId;
    const userFriendId = req.body.userFriendId;
    const state = req.body.state;
    const id = req.params.id;

    const queryUpdateRaw = "UPDATE userfriends SET " +
        (userId ? `userId = "${userId}"` : "") + (userId ? "," : "") +
        (userFriendId ? `userFriendId = "${userFriendId}"` : "") + (userFriendId ? "," : "") +
        (state ? ` state  = "${state}" ` : "");

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

/*UPDATE STATE FOR FRIENDS AND ADD THE INVERSE WITH STATE VALIDATED*/
router.post('/:userId/update/:userFriendId', (req, res) => {
    const userId = req.params.userId;
    const userFriendId = req.params.userFriendId;

    mysql.connection.query("UPDATE userfriends SET state = ? where userId = ? AND userFriendId = ?", ["VALIDATED", userId, userFriendId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
            return;
        } else {
            /*On ajoute une ligne pour l'ami a été ajouté */
            mysql.connection.query('insert into userfriends (userId, userFriendId, state) values(?, ?, ?)', [userFriendId, userId, "VALIDATED"], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: err });
                } else {
                    res.status(200).json(result.insertId);
                }
            })
        }
    })
})

router.delete('/byId/:id', (req, res) => {
    const id = req.params.id;
    mysql.connection.query('DELETE FROM userfriends WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ err: err });
            return;
        } else {
            res.status(200).json(result);
        }
    })

})
/* DELETE Friends */
router.delete('/:userId/delete/:userFriendId', (req, res) => {
    const userId = req.params.userId;
    const userFriendId = req.body.userFriendId;
    mysql.connection.query('DELETE FROM userfriends WHERE userId = ? and userFriendId = ?', [userId, userFriendId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ err: err });
            return;
        } else {
            mysql.connection.query('DELETE FROM userfriends WHERE userId = ? and userFriendId = ?', [userFriendId, userId], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ err: err });
                } else {
                    res.status(200).json(result);
                }
            })
        }
    })

})


module.exports = router;