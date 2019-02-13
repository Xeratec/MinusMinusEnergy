var express = require('express');
const Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/1de4b23aea044238ab6c8500d2420f87'));

var address = '0x22C2FD79de9A389dF193B0819D8CB6DB81B37734';
var key = '6f4d49b5d4d00d7454fa7c3468c90a108795521b31803a2d1d47ca6094e86f03';

var privateKey = new Buffer(key, 'hex');
var txParams = {
  nonce: '0x1e4',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x271000',
  to: '0x6f687DF4B652d7f2A69B4500A478E830d096EebA',
  value: '0x01',
  data: '0x0',
  // EIP 155 chainId - mainnet: 1, ropsten: 3
  chainId: 3
}

var transaction = new tx(txParams);
transaction.sign(privateKey);

var serializedTx = transaction.serialize().toString('hex');

// web3.eth.sendSignedTransaction('0x'+serializedTx,function(err,result){
//   if(err) {
//       console.log(err);
//   } else {
//       console.log("all good");
//       console.log(result);
//   }
// });

const sqlite3 = require('sqlite3').verbose();

function hasNewBill() {
  // TODO: do this
  return true;
}

function getBillData() {
  // TODO
  return {
    energy_needed: 1234,
    tokens_earned: 10,
    price_per_unit: 10
  };
}


let db = new sqlite3.Database('../database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

var app = express();

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));

app.set('view engine', 'pug');

app.route('/').get(function(req, res) {
  res.render('index');
});

app.route('/bill').get(function(req, res) {
  if(hasNewBill()) {
    res.render('bill',getBillData());
  } else {
    res.render('no_bill');
  }
})

app.route('/api').get(function(req, res) {
  var params = req.query;
  var returnData = [];
  db.all('SELECT time, data FROM sensor_data WHERE time<=\''+params.end+'\' AND time>=\''+params.begin+'\'', (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Serving rows: " + rows.length);
    res.send(rows);
  });
});

app.listen(3000);