const dummyData = require('./dummy-data')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const dbPath = "database/boxes.db"
const db = new sqlite3.Database(dbPath)


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
    boxes: dummyData.boxes
  }
  response.render("index.hbs",{})
})
app.get("/leave_box.html",function(request, response){
    response.render("leave_box.hbs",{})
})

app.post('/leave_box.html', function(request, response){
    
    gender = request.body.gender
    message = request.body.message
    dummyData.boxes.push({"gender": gender, "message": message})
    
    // return status (success/fail)
    const status = 1 // success
    response.render("submit_result.hbs",{status: status})
})

app.get("/get_box.html",function(request, response){
    
    response.render("get_box.hbs",{})
})

app.post("/get_box.html",function(request, response){
    
    targer_boxes = []
    const gender = request.body.gender
    dummyData.boxes.forEach(function(box,index){
        // console.log(box)
        if(box.gender==gender){
            targer_boxes.push(box)
        }
    })
    const selected_target_idx = Math.floor(Math.random() * targer_boxes.length) 
    const selected_lucky_box = targer_boxes[selected_target_idx]
    // console.log(selected_lucky_box)
    const model = {"boxes":selected_lucky_box}

    
    // console.log(model)
    response.render("message_prompt.hbs",model)
})

app.get("/faq.html",function(request, response){
    response.render("faq.hbs",{})
})

app.listen(8080)