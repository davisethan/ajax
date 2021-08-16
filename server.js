var bodyParser = require('body-parser');
var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');

var app = express();
app.set('port', process.argv[2]);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/', function(req, res, next){
    // Read all workouts
    if(req.query.query === 'read'){
        mysql.pool.query('SELECT * FROM workouts', function(err, rows){
            if(err){
                next(err);
                return;
            }
            rows = rows.map(function(row){
                date = new Date(row.date).toISOString();
                date = date.slice(0, date.indexOf('T'));
                row.date = date;
                return row;
            });
            res.json(rows);
        });
    // Create new workout
    }else if(req.query.query === 'create'){
        var query = 'INSERT INTO workouts (name,reps,weight,date,lbs) VALUES (?,?,?,?,?)';
        var params = [
        req.query.name,
        req.query.reps,
        req.query.weight,
        req.query.date,
        req.query.lbs];
        mysql.pool.query(query, params, function(err, result){
            if(err){
                next(err);
                return;
            }
            res.json(result.insertId);
        });
    // Update workout
    }else if(req.query.query === 'update'){
        var query = 'SELECT * FROM workouts WHERE id=?';
        var params = [req.query.id];
        mysql.pool.query(query, params, function(err, result){
            var curvals = result[0];
            var query = 'UPDATE workouts SET name=?,reps=?,weight=?,date=?,lbs=? WHERE id=?';
            var params = [
            req.query.name || curvals.name,
            req.query.reps || curvals.reps,
            req.query.weight || curvals.weight,
            req.query.date || curvals.date,
            req.query.lbs || curvals.lbs,
            req.query.id || curvals.id];
            mysql.pool.query(query, params, function(err, result){
                if(err){
                    next(err);
                    return;
                }
            });
        });
    // Delete workout
    }else if(req.query.query === 'delete'){
        var query = 'DELETE FROM workouts WHERE id=?';
        var params = [req.query.id];
        mysql.pool.query(query, params, function(err, result){
            if(err){
                next(err);
                return;
            }
        });
    }
});

/**
 * Clear workouts table
 */
app.get('/reset-table', function(req, res, next){
    mysql.pool.query('DROP TABLE IF EXISTS workouts', function(err){
        if(err){
            next(err);
            return;
        }
        var query = `CREATE TABLE workouts(
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        reps INT,
        weight INT,
        date DATE,
        lbs BOOLEAN)`;
        mysql.pool.query(query, function(err){
            if(err){
                next(err);
                return;
            }
            res.sendFile(path.join(__dirname, '/public/index.html'));
        });
    });
});

app.listen(app.get('port'), function(){
    // console.log(`Visit http://flip3.engr.oregonstate.edu:${app.get('port')}`);
    console.log(`Visit http://localhost:${app.get('port')}`);
});
