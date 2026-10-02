require('dotenv').config()
const express = require('express')
const db = require('./db')
const routes = require('./routes')

const app = express()

async function connection() {
    try {
        const hasTable = await db.schema.hasTable('users')
        if (!hasTable) {
            await db.schema.createTable('users', (table) => {
                table.increments('id').primary()
                table.string('email').unique()
                table.string('password')
            })
        }
    } catch (err) {
        console.log(err)
    }
}
connection()

app.use(express.json())
app.use('/', routes)

module.exports = app
