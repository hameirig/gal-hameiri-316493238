var express = require('express');
var app = express();
var path = require('path');
const bodyParser = require('body-parser');
const csv = require("csvtojson");
const cookieParser = require("cookie-parser");
const sql = require('./db/db');
const CRUD = require("./db/CRUD");
const CRUDdb = require("./db/CRUD_db");
const { read } = require('fs');
var port = 3000;


app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

//for pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');




//routs

//groups page
app.post('/checkJoin', CRUD.checkGroupJoin);

app.get('/groups/:msg', CRUD.enterGroupsMsg);

app.get('/groups', (req, res) => {
    res.redirect('/groups/'+5);
})

app.post('/newGroup', CRUD.insertNewGroup);


//user profile page
app.get('/user_profile', CRUD.selectUserData);

app.post("/updateUserDetails", CRUD.updateUserProfile)


//my groups page

app.get('/removeGroup/:groupName', CRUD.removeUserGroup);


app.get('/my_groups', CRUD.select_user_groups);

app.get('/', (req,res)=>{
    res.redirect('/login');
});


//login page
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'התחברות',
        page_h1: 'התחברות לאתר',
        user_login: false 
    });
});

app.post('/loginData', CRUD.checkUser);


//new account page
app.get('/new_account', (req, res) => {
    res.render('new_account', {
        title: 'הרשמה',
        page_h1: 'הרשמה לאתר',
        user_login: false 
    });
});

app.post('/signUp', CRUD.insertNewAccount);


//search page
app.get('/search', (req, res) => {
    var check_login_user = false;
    if (req.cookies.userEmail != null) {
        check_login_user = true;
    }
    res.render('search', {
        title: 'חיפוש',
        page_h1: 'חפש מגרש',
        user_login: check_login_user
    });
});

app.get('/findCourt', CRUD.findCourt);


//about us page
app.get('/about_us', (req, res) => {
    var check_login_user = false;
    if (req.cookies.userEmail != null) {
        check_login_user = true;
    }
    res.render('about_us', {
        title: 'אודות',
        page_h1: 'אודותינו',
        user_login: check_login_user 
    });
});


//cookie routs

app.get("/setEmailCookie/:email", (req, res) => {
    var userEmail = req.params.email;
    res.cookie('userEmail', userEmail);
    res.redirect('/search');
});

app.get('/deleteUserEmailCookie', (req,res) => {
    res.clearCookie("userEmail");
    res.redirect('/login');
});



////////////initialize db////////////
app.get('/createDBtables', [CRUDdb.createGroupsTable, CRUDdb.createUsersTable, CRUDdb.createUserGroupsTable, CRUDdb.createCourtsTable]);

//insert data
app.get('/insertGroups', CRUDdb.InsertGroupsData);
app.get('/insertUsers', CRUDdb.InsertUsersData);
app.get('/insertCourts', CRUDdb.InsertCourtsData);
app.get('/insertUserGroups', CRUDdb.InsertUserGroupsData);

//show tables
app.get('/showGroups', CRUDdb.ShowGroupsTable);
app.get('/showUsers', CRUDdb.ShowUsersTable);
app.get('/showCourts', CRUDdb.ShowCourtsTable);
app.get('/showUserGroups', CRUDdb.ShowUserGroupsTable);

//drop tables 
app.get('/dropDBtables', [CRUDdb.dropUserGroupsTable, CRUDdb.dropUsersTable, CRUDdb.dropCourtsTable, CRUDdb.dropGroupsTable]);



//listen
app.listen(port, ()=>{
    console.log("express server is running on port "+ port);
});



