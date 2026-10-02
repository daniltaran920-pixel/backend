const express = require('express')
const router = express.Router()
const db = require('./db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('./middlewares')

const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
    const { email, password } = req.body
    const user = await db('users').where('email', email).first()
    const emailCheck = () => email.includes('@') && email.includes('.')

    if(!emailCheck()) return res.status(511).json({message: "Не правильная почта"})
    
        
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z\d]{6,}$/
    if(!passwordRegex.test(password)) return res.status(400).json({message: "weak password"})
    

    if (user) {
        return res.status(400).send("Такой логин уже существует")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    await db('users').insert({
        email: email,
        password: hashPassword
    })

    return res.status(201).json({ message: "Пользователь добавлен в БД" })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await db('users').where('email', email).first()

    if (!user) return res.status(400).json({ message: "Пользователь с таким именем не найден" })

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.status(200).json({
            message: "Успешный вход",
            token: token
        })
    } else {
        return res.status(400).json({ message: "Неверный логин или пароль" })
    }
})

router.get('/profile', authMiddleware, async (req, res) => {
    const user = await db('users').where('id', req.user.id).first()
    return res.status(200).json({
        user: { id: user.id, email: user.email }
    })
})

module.exports = router
