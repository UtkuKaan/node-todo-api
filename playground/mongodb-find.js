const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('\nUnable to connect to MongoDB server');
    } else {
        console.log('\nConnected to MongoDB server');
    }

    // db.collection('Todos').find({
    //     _id: new ObjectID('59ac02d152312118ac135bef')
    // }).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to count todos', err);
    // });

    db.collection('Users').find({name: 'Alycia'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, () => {
        console.log("Unable to fetch documents with the property name equals to 'Utku'");
    });

    // db.close();
});