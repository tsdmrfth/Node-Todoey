const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('ToDoApp')
    db.collection('Todos').findOneAndDelete({ completed: true })
        .then(res => {
            console.log(JSON.stringify(res, undefined, 3))
        })
        .catch(err => {
            console.log('Unable to delete item(s)', err)
        })

    client.close()
})