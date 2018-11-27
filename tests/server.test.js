const expect = require('expect')
const request = require('supertest')

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