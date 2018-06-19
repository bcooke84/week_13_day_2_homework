const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

// what are these again ^^^

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
