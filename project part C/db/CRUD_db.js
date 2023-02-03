var sql = require("./db");
const path = require("path");
const csv = require("csvtojson");

const createGroupsTable = (req,res,next)=>{
    var Q1 = "CREATE TABLE IF NOT EXISTS groups_details (group_name varchar(255) primary key, city ENUM('באר שבע', 'להבים', 'עומר', 'שדרות', 'אופקים') not null, max_players int not null, players_number int not null) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q1,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating groups table"});
            return;
        }
        console.log('groups table created successfully');
        return;
    })
    next();
};

const createUsersTable = (req,res,next)=>{
    var Q2 = "CREATE TABLE IF NOT EXISTS users (email varchar(255) PRIMARY KEY, first_name VARCHAR(255) not null, last_name VARCHAR(255) not null, phone_number VARCHAR(10) not null, city ENUM('באר שבע', 'להבים', 'עומר', 'שדרות', 'אופקים') not null, password varchar(15) not null) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q2,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating users table"});
            return;
        }
        console.log('users table created successfully');
        return;
    })
    next();
};

const createUserGroupsTable = (req,res,next)=>{
    var Q13 = "CREATE TABLE IF NOT EXISTS user_groups (user_email varchar(255), group_name varchar(255), primary key(user_email, group_name), CONSTRAINT FK_userEmail FOREIGN KEY (user_email) REFERENCES users(email), CONSTRAINT FK_group FOREIGN KEY (group_name) REFERENCES groups_details(group_name)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q13,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating user_groups table"});
            return;
        }
        console.log('user_groups table created successfully');
        return;
    })
    next();
};

const createCourtsTable = (req,res)=>{
    var Q3 = "CREATE TABLE IF NOT EXISTS courts (court_name varchar(255) primary key, address VARCHAR(255) not null, city ENUM('באר שבע', 'להבים', 'עומר', 'שדרות', 'אופקים') not null, surface ENUM('דשא', 'דשא סינטטי', 'אספלט') not null, size varchar(10) not null, price int not null, contact_phone varchar(20) null) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q3,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating courts table"});
            return;
        }
        console.log('courts table created successfully');
        //add
        res.send("all tables created");
        return;
    })
};


const InsertGroupsData = (req,res)=>{
    var Q4 = "INSERT INTO groups_details SET ?";
    const csvFilePath= path.join(__dirname, "groups.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    // console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "group_name": element.group_name,
            "city": element.city,
            "max_players": element.max_players,
            "players_number": element.players_number
        }
        sql.query(Q4, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    });
    
    res.send("groups data inserted");

}; 


const InsertUsersData = (req,res)=>{
    var Q5 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "users.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    // console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "email": element.email,
            "first_name": element.first_name,
            "last_name": element.last_name,
            "phone_number": element.phone_number,
            "city": element.city,
            "password": element.password
        }
        sql.query(Q5, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    });
    
    res.send("users data inserted");

};

const InsertUserGroupsData = (req,res)=>{
    var Q14 = "INSERT INTO user_groups SET ?";
    const csvFilePath= path.join(__dirname, "user_groups.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    // console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "user_email": element.user_email,
            "group_name": element.group_name
        }
        sql.query(Q14, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    });
    
    res.send("user groups data inserted");

};


const InsertCourtsData = (req,res)=>{
    var Q6 = "INSERT INTO courts SET ?";
    const csvFilePath= path.join(__dirname, "courts.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var phone = null;
        if (element.contact_phone != ""){
            phone = element.contact_phone;
        }
        var NewEntry = {
            "court_name": element.court_name,
            "address": element.address,
            "city": element.city,
            "surface": element.surface,
            "size": element.size,
            "price": element.price,
            "contact_phone": phone
        }
        sql.query(Q6, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    });
    res.send("courts data inserted");

};

//show tables
const ShowUsersTable = (req,res)=>{
    var Q7 = "SELECT * FROM users";
    sql.query(Q7, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing users table ", err);
            res.send("error in showing users table ");
            return;
        }
        console.log("showing users table");
        res.send(mySQLres);
        return;
    })
};

const ShowGroupsTable = (req,res)=>{
    var Q8 = "SELECT * FROM groups_details";
    sql.query(Q8, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing groups_details table ", err);
            res.send("error in showing groups_details table ");
            return;
        }
        console.log("showing groups_details table");
        res.send(mySQLres);
        return;
    })
};

const ShowUserGroupsTable = (req,res)=>{
    var Q15 = "SELECT * FROM user_groups";
    sql.query(Q15, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing user_groups table ", err);
            res.send("error in showing user_groups table ");
            return;
        }
        console.log("showing user_groups table");
        res.send(mySQLres);
        return;
    })
};

const ShowCourtsTable = (req,res)=>{
    var Q9 = "SELECT * FROM courts";
    sql.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing courts table ", err);
            res.send("error in showing courts table ");
            return;
        }
        console.log("showing courts table");
        res.send(mySQLres);
        return;
    })
};



//drop tables
const dropUserGroupsTable = (req,res,next)=>{
    var Q16 = "DROP TABLE user_groups";
    sql.query(Q16, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping user_groups table ", err);
            res.status(400).send({message: "error in dropping user_groups table" + err});
            return;
        }
        console.log("user_groups table dropped");
        return;
    });
    next();
};

const dropUsersTable = (req,res,next)=>{
    var Q10 = "DROP TABLE users";
    sql.query(Q10, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping users table ", err);
            res.status(400).send({message: "error in dropping users table" + err});
            return;
        }
        console.log("users table dropped");
        return;
    });
    next();
};

const dropCourtsTable = (req,res,next)=>{
    var Q11 = "DROP TABLE courts";
    sql.query(Q11, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping courts table ", err);
            res.status(400).send({message: "error in dropping courts table" + err});
            return;
        }
        console.log("courts table dropped");
        return;
    });
    next();
};

const dropGroupsTable = (req,res)=>{
    var Q12 = "DROP TABLE groups_details";
    sql.query(Q12, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping groups_details table ", err);
            res.status(400).send({message: "error in dropping groups_details table" + err});
            return;
        }
        console.log("groups table dropped");
        res.send("all tables dropped");
        return;
    });
};



module.exports={createGroupsTable, createUsersTable, createCourtsTable, InsertGroupsData, InsertUsersData, InsertCourtsData, dropGroupsTable, dropCourtsTable, dropUsersTable, ShowUsersTable, ShowGroupsTable, ShowCourtsTable, createUserGroupsTable, InsertUserGroupsData, ShowUserGroupsTable, dropUserGroupsTable};