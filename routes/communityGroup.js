var express = require('express');
var router = express.Router();
const mysql = require('../models/db');

/* GET group listing. */
router.get('/', ( req, res) =>{
    mysql.connection.query('SELECT * FROM communitygroup', (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});

/* GET group by its id. */
router.get('/:id', ( req, res) =>{
    const id = req.params.id;
    mysql.connection.query('SELECT * FROM communitygroup where id = ?',[id], (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});

/* GET group users by group id. */
router.get('/:idGroup/users', ( req, res) =>{
    const idGroup = req.params.idGroup;
    mysql.connection.query('SELECT DISTINCT cgu.id, cgu.idGroup, cgu.idUser, u.firstName, u.colorProfil, u.rewardPoints FROM communitygroupuser cgu LEFT JOIN user u ON cgu.idUser = u.userId WHERE cgu.idGroup = ?',[idGroup], (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});




/* GET group by userowner. */
router.get('/userId/:userId', ( req, res) =>{
    const userId = req.params.userId;
    mysql.connection.query('SELECT * FROM communitygroup where userOwner = ?',[userId], (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});

/* GET member numbers of a group. */
router.get('/:groupId/nbMembers', ( req, res) =>{
    const groupId = req.params.groupId;
    mysql.connection.query('SELECT COUNT(cgu.id) as nbMember from communitygroupuser cgu WHERE cgu.idGroup = ?',[groupId], (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});


/* GET group discussion . */
router.get('/:id/discussion', ( req, res) =>{
    const id = req.params.id;
    mysql.connection.query('SELECT DISTINCT cguc.*, u.firstName, u.colorProfil FROM communitygroupuserchat cguc LEFT JOIN communitygroupuser cgu ON cguc.idGroup = cgu.idGroup LEFT JOIN user u ON cguc.idUser = u.userId WHERE cguc.idGroup = ?',[id], (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            res.status(200).json(result);
        }
    });
});

/* PUT group discussion . */
router.put('/:id/discussion', (req, res) =>{
    const idGroup = req.params.id;
    const idUser = req.body.idUser;
    const message = req.body.message;
    const dateEnvoi = req.body.dateEnvoi;
    mysql.connection.query('INSERT into communitygroupuserchat (idGroup, idUser, message, dateEnvoi) values(?, ?, ?, ?)',[idGroup, idUser, message, dateEnvoi], (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err})
        }else{
            console.log(result);
            res.status(200).json(result);
        }
    });
});



/* POST groups */
router.put('/', (req, res) =>{
    const title = req.body.title;
    const colortheme = req.body.colortheme;
    const description = req.body.description;
    const image = req.body.image;
    const userOwner = req.body.userOwner;
    const visibility = req.body.visibility;
    mysql.connection.query('insert into communitygroup (title, colortheme, description, image, userOwner, visibility) values(?, ?, ?, ?, ?, ?)',[title, colortheme, description, image, userOwner, visibility],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({error: err});
        }else{
            const idGroupCreated = result.insertId;
            mysql.connection.query('insert into communitygroupuser (idGroup, idUser) values(?, ?)',[idGroupCreated, userOwner],(err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).send({error: err})
                }else{
                    res.status(200).json(idGroupCreated);
                }
            })
        }
    })
})

router.post('/:id', (req, res) =>{
    const title = req.body.title;
    const colortheme = req.body.colortheme;
    const description = req.body.description;
    const image = req.body.image;
    const userOwner = req.body.userOwner;
    const visibility = req.body.visibility;
    const id=req.params.id;

    const queryUpdateRaw ="UPDATE communitygroup SET " + 
    (title ?`title = "${title}"`: "") + (title?",": "") +
    (colortheme ?`colortheme = "${colortheme}"`: "") + (colortheme?",": "") +
    (description ?`description = "${description}"`: "") + (description?",": "") +
    (image ?`image = "${image}"`: "") + (image?",": "") +
    (userOwner ?`userOwner = "${userOwner}"`: "") + (userOwner?",": "") +
    (visibility ?`visibility = "${visibility}"`: "");

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
    mysql.connection.query('DELETE FROM communitygroup WHERE id = ?',[id],(err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({err: err});
        }else{
            res.status(200).json(result);
        }
    })

})


module.exports = router;