require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todo', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.status(201).send(doc);
    }, (e) => {
        e.serverMessage = "Failed to satisfy model requirements"
        res.status(400).send(e);
    });
});

app.get('/todo', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.status(200).send({todos})
    }, (e) => {
        res.status(400).send(e);
    }   );
});

app.get('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send({error: 'ID not valid'});
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({error: 'Todo not found'})
        }
        res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

app.delete('/todo/:id', authenticate, async (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(400).send({error: 'ID not valid'});
    }

    try {
        const deletedTodo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id});
        if (!deletedTodo) {
            return res.status(404).send({error: 'Todo not found'});
        }
        res.status(200).send({deletedTodo});
    } catch (e) {
        res.status(400).send();
    }
});

app.patch('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(400).send({error: 'ID not valid'});
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_creator: req.user._id, _id: id}, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send({error: 'Todo not found'});
        }

        res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

app.post('/users', async (req, res) => {
    try {
        const user = new User(_.pick(req.body, ['email', 'password']));
        await user.save();
        const token = await user.generateAuthToken();
        res.status(200).header('x-auth', token).send(user);        
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.status(200).header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};
