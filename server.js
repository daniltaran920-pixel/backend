const app = require('./app')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
 // планы на завтра: дописать проверку на почту, и по возможности написать регулярку на пароль от 6 слов 1 заглавная и 1 цифра, и после завтра начать front