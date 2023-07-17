var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/jeffou', function(req, res, next) {
  res.render('test', { title: 'Jeff', content: 'Jeff tu feras gaffe tu regardes un écran.' });
});

module.exports = router;
