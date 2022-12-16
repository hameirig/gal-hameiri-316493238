
//---------------------------------------------active navigation

var activePage = window.location.pathname;
console.log(activePage);

const activeNav = document.querySelectorAll('nav a').forEach( link =>{
    if (link.href.includes(`${activePage}`)) {
        link.classList.add("active");
    }
}
    
);
console.log(activeNav);



//----------------------------------------------------validation


function checkValidMail(){
    res = false;
    const email_input = document.getElementById('Email'); 
    if (email_input.checkValidity()) {
        res = true;
    }
    return res;
}


function checkValidPassward(){
    res = false;
    const pass_input = document.getElementById('Password');
    if (pass_input.checkValidity()) {
        res = true;
    }
    return res;
}


function full_name_validation() {
    let res = false;
    const first_name = document.getElementById("fname").value;
    const last_name = document.getElementById("lname").value;
    const check_firstName = check_letters_only(first_name);
    const check_lastName = check_letters_only(last_name);
    if (!check_firstName) {
        document.getElementById('fname-error').innerHTML = 'שם פרטי צריך להכיל רק אותיות ללא רווחים';
    } else {
        document.getElementById('fname-error').innerHTML = '';
    }
    if (!check_lastName) {
        document.getElementById('lname-error').innerHTML = 'שם משפחה צריך להכיל רק אותיות ללא רווחים';
    } else {
        document.getElementById('lname-error').innerHTML = '';
    }
    if(check_firstName && check_lastName) {
        res = true;
    }
    return res;

}

function check_letters_only(str) {
    return (/^[\u0590-\u05ea]+$/i.test(str) || /^[a-z]+$/i.test(str));
}


function check_players_number(){
    res = false;
    const players_num = document.getElementById("players").value;
    if (players_num>=2 && players_num<=30) {
        res = true;
    }
    return res;

}


//-----------------------------------------------------min DT is now

function setDT() {
    let currentDate = new Date().toISOString().slice(0, -8); 
    let updatedDT = add_hours(currentDate);
    document.querySelector("#datetime").value = updatedDT;
    document.querySelector("#datetime").min = updatedDT;

    
}

function add_hours(dt) {
    let new_date = dt;
    setInterval(() => {
        new_date.setHours(new_date.getHours() + 2);
    }, 1000)
    return new_date;
 }



 //---------------------------------------------------submit animation

 if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1) == 'groups.html') {
    let btn1 = document.getElementById('create_btn');

    document.forms['create_form'].addEventListener('submit', function(e) {
        e.preventDefault();
        form = this;
        setTimeout(function() {
          form.submit();
        }, 7000);
    });
    
    btn1.addEventListener("click", function() {
        let checkNum = check_players_number();
        if (checkNum && document.getElementById("gname").value != "") {
            btn1.setAttribute('class', 'submit process');
            btn1.innerHTML = 'Processing';
            setTimeout(()=>{
               btn1.setAttribute('class', 'submit submitted');
               btn1.innerHTML = `
               <span class="tick">&#10004;</span>
               Submitted
               `;
            },5000);
        }
    
    });
    
    let btn2 = document.getElementById('join_btn');
    
    document.forms['join_form'].addEventListener('submit', function(e) {
        e.preventDefault();
        form = this;
        setTimeout(function() {
          form.submit();
        }, 7000);
    });
    
    btn2.addEventListener("click", function() {
        if (document.getElementById("groupChoice").value != "") {
            btn2.setAttribute('class', 'submit process');
            btn2.innerHTML = 'Processing';
            setTimeout(()=>{
                btn2.setAttribute('class', 'submit submitted');
                btn2.innerHTML = `
                <span class="tick">&#10004;</span>
                Submitted
                `;
            },5000);
        }
    
    });
 }




//-----------------------------------------profile alert
function success_update_alert() {
    let check_name = full_name_validation();
    let check_pass = checkValidPassward();
    if (check_name && check_pass) {
        alert("הפרטים עודכנו בהצלחה!");
        return true;
    }
    else {
        return false;
    }
}

function success_newAccount() {
    let check_email = checkValidMail();
    let check_pass= checkValidPassward()
    let check_name= full_name_validation();
    if (check_name && check_pass && check_email) {
        alert("המשתמש נוצר בהצלחה!");
        return true;
    }
    else {
        return false;
    }

}