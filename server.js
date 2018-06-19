const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

// USED TO CHANGE ITEMS FROM JSON TO JAVASCRIPT OBJECTS

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

// MONGODB LIBRARY ITEMS

MongoClient.connect("mongodb://localhost:27017",
function(err, client) {
  if(err) {
    console.log(err);
    return;
  }

  const db = client.db("celtic_fc"); // MAKES THE DATABASE ON CONNECTION (OR CONNECTS IF IT ALREADY EXISTS)
  console.log("Connected to the database!");

  // CREATE PLAYER
  server.post("/api/players", function(req, res, next) {
    const playersCollection = db.collection("players"); // GET COLLECTION OF PLAYERS
    const playerToSave = req.body; // NEW PLAYER DATA PASSED IN BY USER
    playersCollection.save(playerToSave, function(err, result) {
      if(err) next(err)
      res.status(201) //
      res.json(result.ops[0])
      console.log("saved to database");
    });
  });

  // PLAYERS INDEX
  server.get("/api/players", function(req, res, next) {
    const playersCollection = db.collection("players");
    playersCollection.find().toArray(function(err, allPlayers) {
      if(err) next(err)
      res.json(allPlayers);  // SHOW ALL PLAAYERS IN DATABASE COLLECTION
    });
  });

  // DELETE ALL PLAYERS
  server.delete("/api/players", function(req, res, next) {
    const playersCollection = db.collection("players");
    playersCollection.remove({}, function(err, result) {
      if(err) next(err)
      res.status(200).send()
    });
  });

  // DELETE SPECIFC PLAYER
  server.delete("/api/players/:id", function(req, res, next) {
    const playersCollection = db.collection("players");
    const objectID = ObjectID(req.params.id); 
    playersCollection.remove({_id: objectID}, req.body, function(err, result) {
      if(err) next(err);
      res.status(200).send();
    });
  });

  // UPDATE SPECIFIC PLAYER
  server.post("/api/players/:id", function(req, res, next) {
    const quotesCollection = db.collection("players");
    const objectID = ObjectID(req.params.id);
    quotesCollection.update({_id: objectID}, req.body, function(err, result) {
      if(err) next(err);
      res.status(200).send();
    });
  });

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
});
