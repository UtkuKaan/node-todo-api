const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({_id: '59b0719e7de919366c3e8cce'}).then((todo) => {
    
// });

Todo.findByIdAndRemove('59b0719e7de919366c3e8cce').then((todo) => {
    console.log('Removed:', JSON.stringify(todo, undefined, 2));
});