const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server/server')
const { Todo } = require('./../server/model/Todo')

describe('\nPOST /todos', () => {

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