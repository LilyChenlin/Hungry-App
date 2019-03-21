const express = require('express');
const config = require('./config/index');

const port = process.env.PORT || config.build.port;
const app = express();
const router = express.Router();

router.get('/',function (req,res,next){
  req.url = '/index.html';
  next();
});
app.use(router);
const appData = require('./data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;
router.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  })
})
router.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})
router.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
})
app.use('/api',router);
app.use(express.static('./dist'));
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
