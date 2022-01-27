const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonData = require("./dataLists.json");
const app = express();
const fs = require('fs');
const server = http.createServer(app);
const crypto = require("crypto");

//cors
const options = {
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: true,
};
app.use(cors(options));

//This makes it more difficult for users to see that we are using Express for security
app.disable("x-powered-by");
//import Routes
//To extract json data from Client(post) requests and urlencoded with bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Get All TodoLists
app.get("/todo-list", (req, res) => {
    let listData = require('./dataLists.json');
        res.send(listData);
})
//Add new list
app.post("/todo-new-list", (req, res) => {
    let listData = require('./dataLists.json');
    const fileName = './dataLists.json';
    const id = crypto.randomBytes(16).toString("hex");

    const found = listData.lists.some(el => el.Title === req.body.title);
    if(found){
        res.send('Todo List Already Exists!')
    }
    else{
        listData.lists.push({
            "Title": req.body.title,
            "id": id,
            "todos": []
        })
        fs.writeFile(fileName, JSON.stringify(listData), function writeJSON(err) {
            if (err) return console.log(err);
            else  res.send(listData);
        });
    }
});
// Add new todolist inside a list
app.post("/todo-new-todo", (req, res) => {
    let listData = require('./dataLists.json');
    const fileName = './dataLists.json';
    const found = listData.lists.some(el => el.id === req.body.todoID);
    if(found){
        const todoFound = listData.lists.find(el => el.id === req.body.todoID);
        const id = crypto.randomBytes(16).toString("hex");

        todoFound.todos.push({
          name:req.body.name,
            info:req.body.info,
            id:id,
            status:"notFinished"
        })
        fs.writeFile(fileName, JSON.stringify(listData), function writeJSON(err) {
            if (err) return res.send(err);
            else res.send(listData)
        });
    }
    });
// change todoitem status
app.post("/todo-status", (req, res) => {
    let listData = require('./dataLists.json');
    const fileName = './dataLists.json';
    const todoFound = listData.lists.find(el => el.id === req.body.list).todos.find(item=>item.id===req.body.todoID);
    todoFound.status=req.body.status
    fs.writeFile(fileName, JSON.stringify(listData), function writeJSON(err) {
        if (err) return res.send(err);
        else res.send(listData)
    });
});
// delete todolist
app.post("/todo-delete", (req, res) => {
    let listData = require('./dataLists.json');
    const fileName = './dataLists.json';
    const todoFound = listData.lists.find(el => el.id === req.body.listID);
    const index =listData.lists.indexOf(todoFound);
    if (index > -1) {
        listData.lists.splice(index, 1);
    }
    fs.writeFile(fileName, JSON.stringify(listData), function writeJSON(err) {
        if (err) return res.send(err);
        else res.send(listData)
    });
});
// delete todoitem
app.post("/todo-item-delete", (req, res) => {
    let listData = require('./dataLists.json');
    const fileName = './dataLists.json';

    const todoFound = listData.lists.find(el => el.id === req.body.listID);
    const todoItem = todoFound.todos.find(el => el.id === req.body.todoID);
    const index = todoFound.todos.indexOf(todoItem);

    if (index > -1) {
        todoFound.todos.splice(index, 1);
    }
    fs.writeFile(fileName, JSON.stringify(listData), function writeJSON(err) {
        if (err) return res.send(err);
        else res.send(listData)
    });
});
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
}
const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
})