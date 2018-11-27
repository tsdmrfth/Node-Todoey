const { MongoClient } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')

    const db = client.db('ToDoApp')

    /* db.collection('Todos').insertOne({
        name: 'Finish NodeJS course',
        completed: false
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert Todo')
        }

        console.log(JSON.stringify(res.ops, undefined, 2))
    }) */

    db.collection('Users').insertOne({
        name: 'Hasan',
        age: 25,
        location: 'Istanbul, Kadikoy'
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert User')
        }

        console.log(JSON.stringify(res.ops, undefined, 2))
    })

    client.close()
})