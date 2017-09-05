const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59af12797c0a7714acf1fa267';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// };

// Todo.find({
//     _id: id
// }).then((todos) => console.log('Todos:', todos));

// Todo.findOne({
//     _id: id
// }).then((todo) => console.log('Todo:', todo));

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found');
//     }
//     console.log('Todo By ID:', todo);
// }).catch((e) => console.log(e));

var id = '59ad99617e190d1acc77246e'

User.findById(id).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
    console.log('User found:', JSON.stringify(user, undefined, 2));
}, (e) => console.log(e));