var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todo', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.status(201).send(doc);
    }, (e) => {
        e.serverMessage = "Failed to satisfy model requirements"
        res.status(400).send(e);
    });
});

app.get('/todo', (req, res) => {
    Todo.find().then((todos) => {
        res.status(200).send({todos})
    }, (e) => {
        res.status(400).send(e);
    }   );
});

app.get('/todo/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).send({error: 'ID not valid'});
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({error: 'Todo not found'})
        }
        res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};
