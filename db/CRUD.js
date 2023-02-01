var sql = require("./db");
const path = require("path");
const validation = require("../static/js/projectJS");
//

const checkUser = (req, res)=>{
    if (!req.body) { 
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const userData = {
        "email": req.body.Email,
        "password": req.body.Password
    };
    console.log(userData.email, userData.password);

    sql.query("SELECT email, password FROM users where email like ?", userData.email + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        console.log(mysqlres);
        if (mysqlres.length == 0) {
            res.render('login', {
                title: 'התחברות',
                page_h1: 'התחברות לאתר',
                user_login: false,
                user_email: userData.email,
                email_err: 'כתובת אימייל לא נכונה'
            });
            return;
        }
        else {
            if (mysqlres[0].password == userData.password) {
                res.redirect("/setEmailCookie/" + mysqlres[0].email);
                return;
            } else {
                res.render('login', {
                    title: 'התחברות',
                    page_h1: 'התחברות לאתר',
                    user_login: false,
                    user_email: userData.email,
                    pass_err: 'סיסמה לא נכונה'
                });
                return;
            }
        }
    });
};


const selectUserData = (req, res)=>{
    var userEmail = req.cookies.userEmail;
    sql.query("SELECT * FROM users where email like ?", userEmail + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        console.log(mysqlres);
        res.render('user_profile', {
            title: 'פרופיל משתמש',
            page_h1: 'הפרופיל שלי',
            email: userEmail,
            user_details: mysqlres[0],
            user_login: true
        });
    });
};



const select_user_groups = (req, res)=>{
    var userEmail = req.cookies.userEmail;
    sql.query("SELECT g.* from user_groups u join groups_details g on u.group_name = g.group_name where u.user_email like ?", userEmail + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        console.log(mysqlres);
        res.render('my_groups', {
            title: 'הקבוצות שלי',
            page_h1: 'הקבוצות שלי',
            back_url:"http://localhost:3000/user_profile",
            a_text: 'חזור',
            user_login: true,
            group_list: mysqlres
        })
        return;
    });

};



const findCourt = (req,res)=>{
    // validate body exists
    if (!req.query) {
        res.status(400).send({message: "please fill city to search"});
        return;    
    }
    // pull data from body
    var city = req.query.cityChoice;
    var price = req.query.price;
    var surface = req.query.surface;
    // console.log(city);
    // console.log(price);
    // console.log(surface);


    if (price == "" && surface == "") {
        sql.query("SELECT * FROM courts where city like ?", city + "%", (err, mysqlres)=>{
            if (err) {
                console.log("error: error: ", err);
                res.status(400).send({message:"could not search court"});
                return;
            }
            // console.log("found court: ", mysqlres);
            res.render('results', {
                title: 'תוצאות',
                page_h1: 'מגרשים בסביבתך',
                back_url:"http://localhost:3000/search" ,
                a_text: 'חזור לחיפוש',
                user_login: true,
                court_list: mysqlres
            })
            return;
        })
    }else if (price != "" && surface == ""){
        sql.query("SELECT * FROM courts where city = ? and price <= ?", [city, price], (err, mysqlres2)=>{
            if (err) {
                console.log("error: error: ", err);
                res.status(400).send({message:"could not search court"});
                return;
            }
            res.render('results', {
                title: 'תוצאות',
                page_h1: 'מגרשים בסביבתך',
                back_url:"http://localhost:3000/search" ,
                a_text: 'חזור לחיפוש',
                user_login: true,
                court_list: mysqlres2
            })
            return;
        })
    } else {
        sql.query("SELECT * FROM courts where city = ? and price <= ? and surface = ?", [city, price, surface], (err, mysqlres3)=>{
            if (err) {
                console.log("error: error: ", err);
                res.status(400).send({message:"could not search court"});
                return;
            }
            res.render('results', {
                title: 'תוצאות',
                page_h1: 'מגרשים בסביבתך',
                back_url:"http://localhost:3000/search" ,
                a_text: 'חזור לחיפוש',
                user_login: true,
                court_list: mysqlres3
            })
            return;
        })

    }

}



const updateUserProfile = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    var newDetails = "";
    var check_first_name = validation.checkValidFirstName(req.body.fname);
    var check_last_name = validation.checkValidLastName(req.body.lname);
    var check_password = "";
    if (req.body.Password != "") {
        newDetails = {
            "first_name": req.body.fname,
            "last_name": req.body.lname,
            "phone_number": req.body.phoneNumber,
            "city": req.body.cityChoice,
            "password": req.body.Password
        };
        check_password = validation.checkValidPassword(req.body.Password);
    } else {
        newDetails = {
            "first_name": req.body.fname,
            "last_name": req.body.lname,
            "phone_number": req.body.phoneNumber,
            "city": req.body.cityChoice
        };
    }
    if (check_first_name == "" && check_last_name == "" && check_password == "") {
        sql.query("UPDATE users SET ? where email = ?", [newDetails, userEmail], (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error in update user: " + err + newDetails});
                return;
            }
            res.render('user_profile', {
                title: 'פרופיל משתמש',
                page_h1: 'הפרופיל שלי',
                update_msg: "הפרטים עודכנו בהצלחה",
                user_details: newDetails,
                email: userEmail,
                user_login: true
            });
            
            return;
        });
    } else {
        res.render('user_profile', {
            title: 'פרופיל משתמש',
            page_h1: 'הפרופיל שלי',
            fname_err: check_first_name, 
            lname_err: check_last_name,
            pass_err: check_password,
            user_details: newDetails,
            email: userEmail,
            user_login: true
        });  
        return;
    }
}




const insertNewAccount = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const NewSignUp = {
        "email": req.body.Email,
        "first_name": req.body.fname,
        "last_name": req.body.lname,
        "phone_number": req.body.phoneNumber,
        "city": req.body.cityChoice,
        "password": req.body.Password
    };
    sql.query("select * from users where email like ?", req.body.Email + "%", (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        
        else if (mysqlres.length == 0) {
            var check_first_name = validation.checkValidFirstName(req.body.fname);
            var check_last_name = validation.checkValidLastName(req.body.lname);
            var check_password = validation.checkValidPassword(req.body.Password);
            if (check_first_name == "" && check_last_name == "" && check_password == "") {
                sql.query("INSERT INTO users SET ?", NewSignUp, (err, mysqlres2) => {
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message: "error in create user: " + err + NewSignUp});
                        return;
                    }
                    console.log("created user");
                    res.render('login', {
                        title: 'התחברות',
                        page_h1: 'התחברות לאתר',
                        msg: "נרשמת לאתר בהצלחה! בצע התחברות",
                        user_login: false
                    });
            
                    return;
                });
            } else {
                res.render('new_account', {
                    title: 'הרשמה',
                    page_h1: 'הרשמה לאתר',
                    newAccountDetails: NewSignUp,
                    fname_err: check_first_name,
                    lname_err: check_last_name,
                    pass_err: check_password,
                    user_login: false
                });
                return;
            }

        } else {
            res.render('new_account', {
                title: 'הרשמה',
                page_h1: 'הרשמה לאתר',
                newAccountDetails: NewSignUp,
                email_err: "קיים משתמש עם כתובת אימייל זו, אנא בחר אימייל אחר",
                user_login: false
            });
            return;
        }
        })
}


const insertNewGroup = (req,res)=>{
    // validate body exists
    if (!req.body) {
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    // insert input data from body into json
    const NewGroup = {
        "group_name": req.body.gname,
        "city": req.body.cityChoice,
        "max_players": req.body.players,
        "players_number": 0
    }
        sql.query("select * from groups_details where group_name LIKE ?", NewGroup.group_name + "%", (err, mysqlres) =>{//שאילתה לבדוק אם יש כבר קבוצה בשם כזה
        if (err) {
            console.log("error: error: ", err);
            res.status(400).send({message:"could not create group"});
            return;
        }
        if (mysqlres.length == 0) { //אם אין קבוצה בשם הזה
            sql.query("INSERT INTO groups_details SET ?", NewGroup, (err, mysqlres2) =>{
                if (err) {
                    console.log("error: error: ", err);
                    res.status(400).send({message:"could not create group"});
                    return;
                }
                res.redirect('/groups/'+3);
                return;
            })
        }  else {
            res.redirect('/groups/'+4);
            return;
        }
    })
};



const removeUserGroup = (req, res) => {
    var userEmail = req.cookies.userEmail;
    var group_name = req.params.groupName;
    sql.query("DELETE FROM user_groups WHERE user_email = ? and group_name = ?", [userEmail, group_name], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        else {
            sql.query("select * FROM groups_details WHERE group_name LIKE ?", group_name + "%", (err, mysqlres2) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error: " + err});
                    return;
                }
                console.log("the group:" + mysqlres2);
                var new_players_number = mysqlres2[0].players_number -1;
                console.log(new_players_number);
                sql.query("update groups_details set players_number = ? WHERE group_name = ?",[new_players_number, group_name], (err, mysqlres3) => {
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message: "error: " + err});
                        return;
                    }
                    sql.query("SELECT g.* from user_groups u join groups_details g on u.group_name = g.group_name where u.user_email like ?", userEmail + "%", (err, mysqlres4) => {
                        if (err) {
                            console.log("error: ", err);
                            res.status(400).send({message: "error: " + err});
                            return;
                        }
                        res.render('my_groups', {
                            title: 'הקבוצות שלי',
                            page_h1: 'הקבוצות שלי',
                            back_url:"http://localhost:3000/user_profile",
                            a_text: 'חזור',
                            user_login: true,
                            group_list: mysqlres4,
                            deleted_msg: "הוסרת מהקבוצה בהצלחה!"
                        })
                        return;
                    });
                    
                })

            })
        }  
    })

}



const enterGroupsMsg = (req,res)=>{
    var Msgs = ['הצטרפת לקבוצה בהצלחה', 'את/ה כבר רשומ/ה לקבוצה זו', 'אין מקום בקבוצה זו', 'הקבוצה נוצרה בהצלחה!', 'קיימת קבוצה בשם שבחרת, בחר שם אחר'];
    var Msg_index = req.params.msg;
    sql.query("SELECT group_name FROM groups_details", (err, mysqlres)=>{
        if (err) {
            console.log("error: error: ", err);
            res.status(400).send({message:"could not find groups"});
            return;
        }
        console.log("groups: ", mysqlres);
        if (Msg_index == 5) {
            res.render('groups', {
                title: 'קבוצות',
                page_h1: 'התחבר לקבוצה',
                user_login: true, 
                groupsList: mysqlres,
            });
            return;
        } else if (Msg_index <=2) {
            res.render('groups', {
                title: 'קבוצות',
                page_h1: 'התחבר לקבוצה',
                user_login: true, 
                groupsList: mysqlres,
                join_msg: Msgs[Msg_index]
            });
            return;

        }
        else {
            res.render('groups', {
                title: 'קבוצות',
                page_h1: 'התחבר לקבוצה',
                user_login: true, 
                groupsList: mysqlres,
                create_msg: Msgs[Msg_index]
            });
            return;
        }

    })
}


const checkGroupJoin = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    var userEmail = req.cookies.userEmail;
    var joinGroup = req.body.groupChoice;
    var newJoin = {
        "user_email": userEmail,
        "group_name": joinGroup
    }

    sql.query("select * from user_groups where user_email like ? and group_name like ?", [userEmail, joinGroup], (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        else if (mysqlres.length == 0) { //not in group
            sql.query("select players_number, max_players from groups_details where group_name like ?", joinGroup + "%", (err, mysqlres2) =>{
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error: " + err});
                    return;
                }
                var old_players_num = mysqlres2[0].players_number;

                if (mysqlres2[0].players_number < mysqlres2[0].max_players) {
                    sql.query('INSERT INTO user_groups SET ? ', newJoin, (err, mysqlres3) =>{
                        if (err) {
                            console.log("error: ", err);
                            res.status(400).send({message: "error in join user: " + err + userEmail + joinGroup});
                            return;
                        }
                        sql.query("UPDATE groups_details SET players_number = ? where group_name = ?", [old_players_num+1, joinGroup], (err, mysqlres4) => {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).send({message: "error in update groups: " + err + joinGroup});
                                return;
                            }
                            res.redirect('/groups/'+0);
                            return;
                        })

                    })   

                } else {
                    res.redirect('/groups/'+2);

                }
           })
        } else {
            res.redirect('/groups/'+1);
            return;
        }
    })
}




module.exports = {findCourt, checkUser, select_user_groups, insertNewAccount, insertNewGroup, checkGroupJoin, enterGroupsMsg, selectUserData, updateUserProfile, removeUserGroup};