import express from 'express';
import bodyParser from 'body-parser';

// Set up the express app
const app = express();

// set up mongo db
var mongo_client = require('mongodb').MongoClient;
var mongo_url = 'mongodb://localhost:27017';
mongo_client.connect(mongo_url, (err, client) => {
    if (err) throw err;
    var db = client.db('game_data');
    var collection = db.collection('shapes');
    const cube_attributes = {
        name: 'cube',
        rotation_x: 0.0,
        rotation_y: 0.0,
        rotation_z: 0.0,
        red: 255,
        green: 255,
        blue: 255
    };
    collection.findOne({name: 'cube'}, (err, result) => {
        if (err) throw err;
        console.log(result);
        if (!result) {
            collection.insertOne(cube_attributes, (err, result) => {
                if (err) throw err;
                console.log(result);
                client.close();
            });
        }
        else {
            client.close();
        }
    });
});

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.put('/api/v1/cube', (req, res) => {

    mongo_client.connect(mongo_url, (err, client) => {
        if (err) throw err;
        var db = client.db('game_data');
        var collection = db.collection('shapes');
        collection.findOne({name: 'cube'}, (err, result) => {
            if (err) throw err;
            var cube_attributes = result;
            console.log(req.body);
            var cube_update = {
                $set: {
                    rotation_x: req.body.rotation_x,
                    rotation_y: req.body.rotation_y,
                    rotation_z: req.body.rotation_z,

                    red: req.body.red, 
                    green: req.body.green, 
                    blue: req.body.blue
                }
            };
            collection.updateOne({name: 'cube'}, cube_update, (err, result) => {
                if (err) throw err;
                console.log("cube updated");
                client.close();

                res.status(201).send(cube_update);
            });
        });
    });
})

// get cube data
app.get('/api/v1/cube', (req, res) => {
    mongo_client.connect(mongo_url, (err, client) => {
        if (err) throw err;
        var db = client.db('game_data');
        var collection = db.collection('shapes');
        collection.findOne({name: 'cube'}, (err, result) => {
            if (err) throw err;
            if (result) {
                res.status(200).send(result);
            }
            else {
                res.status(404).send({
                    success: 'false',
                    message: 'cube data not found',
                });
            }
            client.close();
        });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});