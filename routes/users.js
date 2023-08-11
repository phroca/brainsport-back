var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET users listing. */
router.get('/', (req, res) => {
    mysql.connection.query('SELECT * FROM user', (err, result) => {
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
router.get('/byChar/:char', (req, res) => {
    const char = req.params.char;
    const query = `SELECT * FROM user where firstName LIKE "${char}%"`;
    mysql.connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});



/* GET user by userId. */
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    mysql.connection.query('SELECT * FROM user where userId = ?', [userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

/*Get User rank and User total number*/
router.get('/:userId/rank', (req, res) => {
    const userId = req.params.userId;
    mysql.connection.query("SELECT COUNT(*) from user", (err, result) => {
        if (err) {
            res.status(500).send({ error: err });
            return;
        } else {
            const totalNumberUsers = result[0]["COUNT(*)"];
            mysql.connection.query('SELECT rank FROM (SELECT u.*, rank() over (ORDER BY rewardPoints DESC) as rank from user u) u WHERE userId = ?', [userId], (err, result) => {
                if (err) {
                    res.status(500).send({ error: err })
                    return;
                } else {
                    const finalResult = {
                        "totalUsers": totalNumberUsers,
                        "userRank": result[0].rank
                    }
                    res.status(200).json(finalResult);
                }
            });
        }


    })

});


/* GET user group by user ID with member numbers. */
router.get('/:userId/groups', (req, res) => {
    const userId = req.params.userId;
    mysql.connection.query('SELECT DISTINCT cg.id, cgu.id as groupUserId, cg.title, cg.colortheme, cg.description, cg.image, u.firstName as userOwner, cg.visibility, (SELECT COUNT(*) FROM communitygroupuser WHERE idGroup = cg.id AND state="VALIDATED") as nbMember from communitygroup cg LEFT JOIN communitygroupuser cgu ON cg.id = cgu.idGroup LEFT JOIN user u ON cg.userOwner = u.userId WHERE cgu.idUser = ? AND cgu.state = ?', [userId, "VALIDATED"], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

/* GET user group by user ID with member numbers. */
router.get('/:userId/waitingGroups', (req, res) => {
    const userId = req.params.userId;
    mysql.connection.query('SELECT DISTINCT cg.id, cgu.id as groupUserId, cg.title, cg.colortheme, cg.description, cg.image, u.firstName as userOwner, cg.visibility, (SELECT COUNT(*) FROM communitygroupuser WHERE idGroup = cg.id AND state="VALIDATED") as nbMember from communitygroup cg LEFT JOIN communitygroupuser cgu ON cg.id = cgu.idGroup LEFT JOIN user u ON cg.userOwner = u.userId WHERE cgu.idUser = ? AND cgu.state = ?', [userId, "WAITING"], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err })
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

/* GET user group by user ID and group id with member numbers. USED TO VALIDATE CREATION OF A GROUP */
router.get('/:userId/groups/:groupId', (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    mysql.connection.query('SELECT DISTINCT cg.id, cg.title, cg.colortheme, cg.description, cg.image, u.firstName as userOwner, cg.visibility, cgu.state, (SELECT COUNT(*) FROM communitygroupuser WHERE idGroup = cg.id) as nbMember from communitygroup cg LEFT JOIN communitygroupuser cgu ON cg.id = cgu.idGroup LEFT JOIN user u ON cg.userOwner = u.userId WHERE cgu.idUser = ? AND cgu.idGroup = ?', [userId, groupId], (err, result) => {
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
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const birthDate = req.body.birthDate;
    const phoneNumber = req.body.phoneNumber;
    const bio = req.body.bio;
    const colorProfil = req.body.colorProfil;
    const address = req.body.address;
    const zipCode = req.body.zipCode;
    const city = req.body.city;
    const region = req.body.region;
    mysql.connection.query('insert into user (userId, email, firstName, lastName, birthDate, phoneNumber, bio, colorProfil, address, zipCode, city, region) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, email, firstName, lastName, birthDate, phoneNumber, bio, colorProfil, address, zipCode, city, region], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
            return;
        } else {
            res.status(200).json(result.insertId);
        }
    })
})

router.post('/:userId', (req, res) => {
    const userId = req.params.userId;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const birthDate = req.body.birthDate;
    const phoneNumber = req.body.phoneNumber;
    const bio = req.body.bio;
    const colorProfil = req.body.colorProfil;
    const rewardPoints = req.body.rewardPoints;
    const address = req.body.address;
    const zipCode = req.body.zipCode;
    const city = req.body.city;
    const region = req.body.region;

    const queryUpdateRaw = "UPDATE user SET " +
        (email ? ` email  = "${email}"` : "") + ((email) ? "," : "") +
        (firstName ? ` firstName = "${firstName}"` : "") + ((firstName) ? "," : "") +
        (lastName ? ` lastName = "${lastName}"` : "") + ((lastName) ? "," : "") +
        (birthDate ? ` birthDate = ${birthDate}` : "") + ((birthDate) ? "," : "") +
        (phoneNumber ? ` phoneNumber = "${phoneNumber}"` : "") + ((phoneNumber) ? "," : "") +
        (bio ? ` bio = "${bio}"` : "") + ((bio) ? "," : "") +
        (colorProfil ? ` colorProfil = "${colorProfil}"` : "") + ((colorProfil) ? "," : "") +
        (rewardPoints ? ` rewardPoints = ${rewardPoints}` : "") + ((rewardPoints) ? "," : "") +
        (address ? ` address = "${address}"` : "") + ((address) ? "," : "") +
        (zipCode ? ` zipCode = "${zipCode}"` : "") + ((zipCode) ? "," : "") +
        (city ? ` city = "${city}"` : "") + ((city) ? "," : "") +
        (region ? ` region = "${region}" ` : "");

    const queryUpdate = queryUpdateRaw.substring(0, queryUpdateRaw.length - 1);

    mysql.connection.query(queryUpdate + ` where userId = "${userId}";`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
            return;
        } else {
            res.status(200).json(result);
        }
    })
})

router.get('/:userId/rewardPoints', (req, res) => {
    const userId = req.params.userId;
    mysql.connection.query('SELECT rewardPoints FROM user WHERE userId = ?', [userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ err: err });
            return;
        } else {
            res.status(200).json(result);
        }
    })

})

router.post('/:userId/rewardPoints', (req, res) => {
    const userId = req.params.userId;
    const rewardPoints = req.body.rewardPoints;
    mysql.connection.query('UPDATE user SET rewardPoints = ? WHERE userId = ?', [rewardPoints, userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ err: err });
            return;
        } else {
            res.status(200).json(result);
        }
    })

})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    mysql.connection.query('DELETE FROM user WHERE id = ?', [id], (err, result) => {
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