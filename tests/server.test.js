const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')
const JWT = require('jsonwebtoken')

const { app } = require('./../server/server')
const { Todo } = require('./../server/model/Todo')
const { User } = require('./../server/model/User')

const user2Id = new ObjectID()
const mockUsers = [
    {
        _id: new ObjectID(),
        email: 'babalar@babalar.com',
        password: 'babalar',
        age: 20
    },
    {
        _id: user2Id,
        email: 'babalar1@babalar.com',
        password: 'babalar',
        age: 20,
        tokens: [
            {
                access: 'auth',
                token: JWT.sign({ _id: user2Id, access: 'auth' }, 'baba.js').toString()
            }
        ]
    }
]

const mockTodos = [
    {
        _id: new ObjectID(),
        text: 'Mock todo 1',
        owner: user2Id
    },
    {
        _id: new ObjectID(),
        text: 'Mock todo 2',
        completed: true,
        completedAt: 322,
        owner: user2Id
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
            .post('/api/todos')
            .send({})
            .expect(401)
            .end(done)
    });

    const store = it('should save todo if text is sent', (done) => {
        const text = 'Text to test'
        request(app)
            .post('/api/todos')
            .send({ text, owner: user2Id })
            .expect(401)
            .end(done)
    });

    after('store', (done) => {
        Todo.deleteOne({ text: 'Text to test' }).then(() => done())
    })
})

describe('GET /todos/:id', () => {

    it('should return status code 404 if id is not a valid ObjectID', (done) => {
        const id = '31283udsjfkads'
        request(app)
            .get(`/api/todos/${id}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 with Todo not found message if no todo', (done) => {
        const id = new ObjectID().toHexString()
        request(app)
            .get(`/api/todos/${id}`)
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
            .delete(`/api/todos/${id}`)
            .expect(404)
            .end(done)
    })

    it('should delete todo if id is valid', (done) => {
        const id = mockTodos[0]._id
        request(app)
            .delete(`/api/todos/${id}`)
            .expect(200)
            .end(done)
    })

    it('should return deleted todo', (done) => {
        const id = mockTodos[0]._id.toHexString()
        request(app)
            .delete(`/api/todos/${id}`)
            .expect(res => {
                expect(res.body.todo._id).toEqual(id)
            })
            .end(done)
    })

})

describe('PATCH /todos/:id', () => {

    it('should return status code 404 if no id sent', (done) => {
        request(app)
            .patch('/api/todos')
            .expect(404)
            .end(done)
    })

    it('should return status code 404 and message `Id is not valid` if the id is not valid', (done) => {
        const id = '3sdf12'
        request(app)
            .patch(`/api/todos/${id}`)
            .expect(res => {
                expect(res.status).toEqual(404)
                expect(res.text).toEqual('Id is not valid')
            })
            .end(done)
    })

    it('should update completedAt to null if completed is false', (done) => {
        const id = mockTodos[1]._id.toHexString()

        request(app)
            .patch(`/api/todos/${id}`)
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
            .post('/api/users')
            .send(mockUser)
            .expect(400)
            .expect(res => {
                expect(res.body.message).toEqual('This email is already registered')
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
            .post('/api/users')
            .send(mockUser)
            .expect(res => {
                expect(res.header['x-auth']).toBeDefined()
            })
            .end(done)
    })

})

describe('POST /users/me', () => {

    it('should return same token if user is stored in database', (done) => {
        const token = mockUsers[1].tokens[0].token
        request(app)
            .get('/api/users/me')
            .set('x-auth', token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toContain(mockUsers[1]._id)
            })
            .end(done)
    })

})

describe('POST /api/users/me', (done) => {
    it('should return status code 400 if email is not sent', (done) => {
        request(app)
            .post('/api/users/login')
            .send({ password: 'djkasda' })
            .expect(400)
            .end(done)
    })
    it('should return status code 400 if password is not sent', (done) => {
        request(app)
            .post('/api/users/login')
            .send({ email: 'daasdas' })
            .expect(400)
            .end(done)
    })
    it('should return return status 19000 code in body if any user not found', (done) => {
        request(app)
            .post('/api/users/login')
            .send({ email: 'dhdh@mms', password: 'dasd' })
            .expect(res => {
                expect(res.body.status).toEqual(19000)
            })
            .end(done)
    })
    it('should return invalid credentials status code if password is not true', (done) => {
        request(app)
            .post('/api/users/login')
            .send({ email: 'babalar@babalar.com', password: 'adjkasjad' })
            .expect(res => {
                expect(res.body.status).toEqual(19100)
            })
            .end(done)
    })
    it('should return user if email and password are correct', (done) => {
        request(app)
            .post('/api/users/login')
            .send({ email: 'babalar@babalar.com', password: 'babalar' })
            .expect(res => {
                expect(res.body.user.email).toEqual('babalar@babalar.com')
            })
            .end(done)
    })
})