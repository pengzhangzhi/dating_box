const utilities = require('./utilities')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()


const dbPath = "database/boxes.db"
const db = new sqlite3.Database(dbPath)


create_boxes_table_query = "CREATE TABLE IF NOT EXISTS boxes (id INTEGER PRIMARY KEY AUTOINCREMENT,gender TEXT NOT NULL, content TEXT, picked INTEGER DEFAULT 0)"
db.run(create_boxes_table_query,function(err){
    if(err){
        throw err
    }
    else{
        console.log("Intialize TABLE boxes!")
    }
})




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

  response.render("index.hbs",{})
})
app.get("/leave_box.html",function(request, response){
    response.render("leave_box.hbs",{})
})

app.post('/leave_box.html', function(request, response){
    var status = 1 // success
    
    gender = request.body.gender
    message = request.body.message

    insert_query = "INSERT INTO boxes (gender, content) VALUES (?, ?)"

    db.run(insert_query,[gender, message],function(err){
        if(err){
            status = 0
            throw err
        }
        else{
            console.log(insert_query)
        }
    })

    
    response.render("submit_result.hbs",{status: status})
})

app.get("/get_box.html",function(request, response){
    
    response.render("get_box.hbs",{})
})

app.post("/get_box.html",function(request, response){
    
    const gender = request.body.gender
    const picked = 0
    retrieve_query = "SELECT * FROM boxes where gender = ? and picked = ?"
    db.all(retrieve_query,[gender,picked],function(err,retrieved_data){
        
        if(err){
            throw err
        }
        else{
            selected_lucky_box = utilities.randomly_select_box(retrieved_data)
            
            
            if(retrieved_data.length == 0)
            {
                
                response.render("message_prompt.hbs",null)
            }
            else
            {
                box_content = selected_lucky_box.content
                
                box_id = selected_lucky_box.id
                const model = {"content":box_content}
                response.render("message_prompt.hbs",model)

                utilities.set_box_to_picked(box_id,db)
            }
            
        }
    })

   
})

app.get("/faq.html",function(request, response){
    response.render("faq.hbs",{})
})


app.listen(8080)