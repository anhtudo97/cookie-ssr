const express = require('express')
const cookie = require('cookie-parser')
const app = express();
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(cookie())

// 
const db = {
    users: [
        {
            id: 1,
            email: "tuanh@gmail.com",
            password: "123",
            name: "tuanh"
        }
    ]
}

const sessions = {

}

// GET 
app.get('/', (req, res) => {
    res.render('pages/index')
})

// GET
app.get('/login', (req, res) => {
    res.render('pages/login')
})

// GET
app.get('/dashboard', (req, res) => {
    const session = sessions[req.cookies.sessionId];
    if (!session) return res.redirect('/login')

    const user = db.users.find(user => user.id === session.userId)
    if (!user) {
        return res.redirect('/login')
    }

    res.render('pages/dashboard', {
        user
    })
})

// GET
app.get('/logout', (req, res) => {
    delete sessions[req.cookies.sessionId];
    res.setHeader('Set-Cookie', 'sessionId=; max-age=0').redirect('/login')
})

// POST 
app.post('/login', (req, res) => {
    const { email, password } = req.body

    const user = db.users.find(user => user.email === email && user.password === password)
    if (user) {
        // console.log(user)
        const sessionId = Date.now().toString();
        sessions[sessionId] = {
            userId: user.id
        }

        res.setHeader('Set-Cookie', `sessionId=${sessionId}; httpOnly; max-age=3600`).redirect('/dashboard')
        // res.json(user)
        return;
    }
    res.send("Account is invalid")
})

app.listen(port, () => {
    console.log("Demo app is running on port: ", port)
})