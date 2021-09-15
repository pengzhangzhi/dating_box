const dummyData = require('./dummy-data')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const app = express()


app.engine('hbs', expressHandlebars({
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ]
}))

app.get('/', function(request, response){
  const model = {
    humans: dummyData.humans
  }
  response.render("index.hbs",{})
})
app.get("/leave_box.html",function(request, response){
    response.render("leave_box.hbs",{})
})
app.get("/get_box.html",function(request, response){
    response.render("get_box.hbs",{})
})

app.get("/faq.html",function(request, response){
    response.render("faq.hbs",{})
})

app.listen(8080)