const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate(
    //     {_id: new ObjectID('59ac24e335f57a72ab106336')},
    //     {$set: {completed: true}},
    //     {returnOriginal: false}
    // ).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate(
        {_id: new ObjectID('59ac2fc635f57a72ab106508')},
        {$set: {name: 'Kaycee'}, $inc: {age: 1}},
        {returnOriginal: false}
    ).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('\nUnable to find and update\n', err);
    });


    


});