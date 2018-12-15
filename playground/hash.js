const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')

const message = 'This is a big message to send 256 users'
const hashed = SHA256(message).toString()
console.log(hashed, 'Hashed message')

const data = {
    id: 4
}
const token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'secret').toString()
}
token.data.id = 5
const resultHash = SHA256(JSON.stringify(data) + 'secret').toString()
console.log(token.hash, resultHash)

const JWTToken = jwt.sign(JSON.stringify(data), 'secret')
console.log(JWTToken)
const encodedJWTToken = jwt.verify(JWTToken, 'secret')
console.log(encodedJWTToken)
