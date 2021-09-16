const dummyData = require('./dummy-data')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')

// register views, base layouts, and partials.
app.engine('hbs', expressHandlebars({
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ]
}))

app.use(bodyparser.urlencoded({extended:false}))


app.get('/', function(request, response){
  const model = {
    humans: dummyData.humans
  }
  response.render("index.hbs",{})
})
app.get("/leave_box.html",function(request, response){
    response.render("leave_box.hbs",{})
})

app.post('/leave_box.html', function(request, response){
    
    gender = request.body.gender
    message = request.body.message
    console.log(message+" "+gender)
    response.render("leave_box.hbs",{})
})

app.get("/get_box.html",function(request, response){
    
    response.render("get_box.hbs",{})
})
app.post("/get_box.html",function(request, response){
    const model = {
        humans:dummyData.humans
    }
    const gender = request.body.gender
    console.log(gender)
    response.render("message_prompt.hbs",model)
})

app.get("/faq.html",function(request, response){
    response.render("faq.hbs",{})
})

app.listen(8080)