const { MongoClient } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('ToDoApp')
    db.collection('Todos').find({ completed: false }).toArray()
        .then(res => {
            console.log(JSON.stringify(res, undefined, 2))
        }).catch(err => {
            console.log('Unable to fetch Todos', err)
        })
    client.close()
})