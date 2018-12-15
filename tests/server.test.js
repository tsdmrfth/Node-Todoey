const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server/server')
const { Todo } = require('./../server/model/Todo')
const { User } = require('./../server/model/User')

const mockTodos = [
    {
        _id: new ObjectID(),
        text: 'Mock todo 1'
    },
    {
        _id: new ObjectID(),
        text: 'Mock todo 2',
        completed: true,
        completedAt: 322
    }
]

const mockUsers = [
    {
        _id: new ObjectID(),
        email: 'babalar@babalar.com',
        password: 'babalar',
        age: 20
    },
    {
        _id: new ObjectID(),
        email: 'babalar1@babalar.com',
        password: 'babalar',
        age: 20
    }
]

beforeEach(done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(mockTodos)
    }).then(() => done())
})

beforeEach(done => {
    User.deleteMany({}).then(() => {
        return User.insertMany(mockUsers)
    }).then(() => done())
})

describe('POST /todos', () => {

    it('should return status code 404 if text parameter did not send', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end(done)
    });

    const store = it('should save todo if text is sent', (done) => {
        const text = 'Text to test'
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .end(done)
    });

    after('store', (done) => {
        Todo.deleteOne({ text: 'Text to test' }).then(() => done())
    })

    it('should return back text that is sent', (done) => {
        const text = 'Hello test'
        request(app)
            .post('/todos')
            .send({ text })
            .expect(res => {
                expect(res.body.text).toBe(text)
            })
            .end(done)
    })

})

describe('GET /todos/:id', () => {

    it('should return status code 404 if id is not a valid ObjectID', (done) => {
        const id = '31283udsjfkads'
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 with Todo not found message if no todo', (done) => {
        const id = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${id}`)
            .expect(res => {
                expect(res.body.message).toEqual('Todo not found')
            })
            .end(done)
    })

})

describe('DELETE /todos/:id', () => {

    it('should return status code 404 if id is not a valid ObjectID', (done) => {
        const id = 'sjkdaskdj'
        request(app)
            .delete(`/delete/${id}`)
            .expect(404)
            .end(done)
    })

    it('should delete todo if id is valid', (done) => {
        const id = mockTodos[0]._id
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .end(done)
    })

    it('should return deleted todo', (done) => {
        const id = mockTodos[0]._id.toHexString()
        request(app)
            .delete(`/todos/${id}`)
            .expect(res => {
                expect(res.body.todo._id).toEqual(id)
            })
            .end(done)
    })

})

describe('PATCH /todos/:id', () => {

    it('should return status code 404 if no id sent', (done) => {
        request(app)
            .patch('/todos')
            .expect(404)
            .end(done)
    })

    it('should return status code 404 and message `Id is not valid` if the id is not valid', (done) => {
        const id = '3sdf12'
        request(app)
            .patch(`/todos/${id}`)
            .expect(res => {
                expect(res.status).toEqual(404)
                expect(res.text).toEqual('Id is not valid')
            })
            .end(done)
    })

    it('should update completedAt to null if completed is false', (done) => {
        const id = mockTodos[1]._id.toHexString()

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toBeNull()
            })
            .end(done)

    })

})

describe('POST /users', () => {

    it('should return status code 400 if email is registered', (done) => {
        const mockUser = mockUsers[1]
        request(app)
            .post('/users')
            .send(mockUser)
            .expect(400)
            .expect(res => {
                expect(res.text).toEqual('This email is already registered')
            })
            .end(done)
    });

    it('should return token in header', (done) => {
        const mockUser = {
            _id: new ObjectID(),
            email: 'babalar5@babalar.com',
            password: 'babalar',
            age: 20
        }
        request(app)
            .post('/users')
            .send(mockUser)
            .expect(res => {
                expect(res.header['x-auth']).toBeDefined()
            })
            .end(done)
    })

})