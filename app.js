const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI
mongoose.connect(uri);
var _ = require('lodash');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true})) // Allows us to handle with the body in the coming request.
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

const blogPostSchema = new mongoose.Schema({
    title: String,
    paragraph: String
})

const BlogPost = mongoose.model("BlogPost", blogPostSchema)

app.set('view engine', 'ejs');

app.get('/', (req, res) => {    
    BlogPost.find({}, {"title":1, "paragraph":1, _id:0 }, (err, allPosts) => {
        res.render('home', {postTitles: _.map(allPosts, "title"), posts: _.map(allPosts, "paragraph")});
    })
})

app.post('/', (req, res) => {
    var postTitle = req.body.inputTitle
    var post = req.body.post

    const blogPost = new BlogPost({
        title: postTitle,
        paragraph: post
    })

    blogPost.save()
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

app.get('/posts/:postName', (req, res) => {
    BlogPost.find({}, {"title":1, "paragraph":1, _id:0 }, (err, allPosts) => {
        res.render('post', {postTitle: _.map(allPosts, "title")[currentPostNo], post: _.map(allPosts, "paragraph")[currentPostNo]});
    })
})

var currentPostNo = null
app.post('/posts', (req, res) => {
    currentPostNo = req.body.postNo
    BlogPost.find({}, {"title":1, _id:0 }, (err, allPosts) => {
        res.redirect("/posts/:" + _.map(allPosts, "title")[currentPostNo])
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})