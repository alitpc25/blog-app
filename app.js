const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true})) // Allows us to handle with the body in the coming request.
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 3000
var postTitles = []
var posts = []

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', {postTitles: postTitles, posts: posts});
})

app.post('/', (req, res) => {
    var postTitle = req.body.inputTitle
    var post = req.body.post
    postTitles.push(postTitle)
    posts.push(post)
    res.redirect("/")
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/compose', (req, res) => {
    res.render('compose');
})

app.get('/posts', (req, res) => {
    res.render('post', {postTitles: postTitles, posts: posts});
})

app.get('/posts/:postName', (req, res) => {
    res.render('post', {postTitle: postTitles[currentPostNo], post: posts[currentPostNo]});
})

var currentPostNo = null
app.post('/posts', (req, res) => {
    currentPostNo = req.body.postNo
    res.redirect("/posts/:" + postTitles[currentPostNo])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})