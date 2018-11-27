const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('ToDoApp')
    db.collection('Todos').findOneAndUpdate(
        { _id: new ObjectID('5bfd9c82e4d70b57cacd6239') },
        {
            $set: {
                completed: true
            }
        },
        null,
        (err, res) => {
            if (err) {
                return console.log('Unable to update item', err)
            }

            console.log(JSON.stringify(res, undefined, 2))
        }
    )
    client.close()
})