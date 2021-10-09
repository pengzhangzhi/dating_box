const utilities = require('./utilities')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// question data
const question = {question_id:1,question_title:"孔目湖在哪个校区？",answer:"南区"}

// database initialization
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

// db.run( "UPDATE boxes SET picked = 0 WHERE picked = 1",function(err){})


// session
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24 * 7;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(cookieParser());

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

// index page
app.get('/', function(request, response){

  response.render("index.hbs",{})
})

// leave box
app.get("/leave_box.html",function(request, response){
    response.render("leave_box.hbs",{})
})

app.post('/leave_box.html', function(request, response){
    var session = request.session
    if(session.leave_valid && session.leave_valid<2){
        var status = 1 // success
    
        gender = request.body.gender
        message = request.body.message

	picked = 0
        insert_query = "INSERT INTO boxes (gender, content,picked) VALUES (?, ?,?)"

        db.run(insert_query,[gender, message,picked],function(err){
            if(err){
                status = 0
                throw err
            }
            else{
                console.log(insert_query+gender+" "+message+" "+picked)
            }
        })

        if(status){
            session.leave_valid ++;
            response.render("submit_result.hbs",{message:"提交成功！"})
        }
        else{
            response.render("submit_result.hbs",{message:"提交失败！"})
        }
        
    }
    
    else if(session.leave_valid>=2){
        // pick chance have been used.
        response.render("submit_result.hbs",{message:"每人只有一次留盲盒的机会，你已经用完啦~去抽一个吧！"})
    }
    else{
        response.redirect("/question.html")
    }

    
})
// question page.
app.get("/question.html",function(request, response){
    // select question id and render the question
    
    console.log(question)
    response.render("question.hbs",{question:question}) 
})

app.post("/question.html",function(request, response){
    // retrieve question and answer from user and pick up desired_answer from database. 
    // verify if the question and answer are paired.
    // if valid set up session and cookies.
    // else return wrong answer message.
    const question_title = request.body.question
    const answer = request.body.answer
    const id = request.body.id
    // select the question by id
    // question = xxx

    const correct_answer = question["answer"]
    var session = request.session
    if(correct_answer == answer){
       session.leave_valid = 1
       session.get_valid = 1
       response.render("submit_result.hbs",{message:"正确！可以去留或抽盲盒啦！"})
    }
    else{
        // wrong answer, 
        response.render("wrong_answer.hbs")
        
    }
    
})

// get box
app.get("/get_box.html",function(request, response){
    
    response.render("get_box.hbs",{})
})

app.post("/get_box.html",function(request, response){
    /*
    check sessions.valid
    if sessions.valid:
        selection

    else:
        answer question
    
    */ 
   var session = request.session

    if(session.get_valid && session.get_valid < 2)
    {
        const gender = request.body.gender
        const picked = 3
        retrieve_query = "SELECT * FROM boxes where gender = ? and picked <= ?"
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
                    session.get_valid++;
                    box_content = selected_lucky_box.content
                    
                    box_id = selected_lucky_box.id
                    const model = {"content":box_content}
                    response.render("message_prompt.hbs",model)

                    utilities.set_box_to_picked(box_id,db)
                }
                
        }
    })
    }
    else if(session.get_valid >=2){
    response.render("submit_result.hbs",{message:"每人只有一次抽盲盒的机会，你已经用完啦~去留一个吧！"})

    }
    else{
        response.redirect("/question.html")
    }

   
})

app.get("/ToUser.html",function(request,response){
response.render("ToUser.hbs")

})

app.get("/faq.html",function(request, response){
    response.render("faq.hbs",{})
})

app.get("/admin.html",function(request, response){
    retrieve_query = "SELECT * FROM boxes"
        db.all(retrieve_query,function(err,retrieved_data){
            
        if(err){
            throw err
        }
        else{
            
            console.log(retrieved_data)
            response.render("admin.hbs",{retrieved_data})
            
                
        }
    })
    
})
app.listen(8080)
