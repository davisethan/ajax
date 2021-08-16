var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs290_davietha',
  password: '7401',
  database: 'cs290_davietha'
});

module.exports.pool = pool;
