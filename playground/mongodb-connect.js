// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')
    
    // db.collection('Todos').insertOne({
    //     text: 'Complete node.js course',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         console.log('Unable to insert todo', err);
    //     }
    //     else {
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     }
    // });

    // db.collection('Users').insertOne({
    //     name: 'Utku',
    //     age: 18,
    //     location: 'Turkey'
    // }, (err, res) => {
    //     if (err) {
    //         console.log('Unable to instert user', err);
    //     } else {
    //         console.log(JSON.stringify(res.ops, undefined, 2));
    //         console.log(res.ops[0]._id.getTimestamp())
    //     }
    // });    
    
    db.close();
    
});