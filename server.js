const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const path = require('path');
const mong = require("mongoose");
const fs = require('fs');
const e = require('express');
const ejs = require("ejs")
const session = require("express-session");
const request = require("request")
const fetch = require("node-fetch")
const port =  process.env.PORT || 5000;
const u = [];
const bodyParser = require('body-parser');
//var access_token;

const cors = require("cors");
const { regexpToText } = require('nodemon/lib/utils');
const { Console } = require('console');
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
//mong.connect("mongodb://localhost:27017/UpCode").
mong.connect("mongodb://localhost:27017/UpCode").
    then(() => console.log("Connection to MongoDB established successfully "))
    .catch((err) => console.log(err));
app.set('view engine', 'ejs')
// USERS COLLECTION SCHEMA   
const auth = new mong.Schema({
    name: String,
    password: String,
    codechef_profile: String,
    codeforces_profile: String,
    Access_token: []
})
const Authentication = new mong.model("User", auth);

// CHALLENGE COLLECTION SCHEMA
const chalng = new mong.Schema({
    creator: String,
    problem_name: String,
    platform: String,
    duration: Date,
    link: String,
    completed: []
})
const Challenge = new mong.model("Challenge", chalng);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('views/static'));
app.use(session({
    secret: "session code",
    cookie: { maxAge: 90000000 },
    saveUninitialized: true,
    resave: true
}))


// WEB ROUTES 

app.get('/', (req, res) => {
    console.log("Auth code before logging in " + req.session.auth_code)
    Challenge.find({}, function (err, chal) {
        Object.entries(chal).forEach(challeng => {
            var date = new Date();
            if (challeng[1].duration <= date) {
                Challenge.deleteOne({ problem_name: challeng[1].problem_name }, function (err, response) {
                    if (!err) {
                        console.log("Deletion performed successfully ");
                    }
                })
            }
        })
    })
    Challenge.find({}, function (err, chal) {
        if (req.query.code != undefined && req.session.auth_code == undefined) {
            req.session.auth_code = req.query.code;
            // var access_code = getAccessToken(auth_code);
            // console.log("HERES THE ACCESS CODE " + (access_code));
            var cli_id = "{your_client_id}";
            var cli_secret = "{your_client_secret}";
            console.log("Auth code from session variable " + req.session.auth_code)
            var getAuthorized = {
                uri: "https://api.codechef.com/oauth/token",
                body: JSON.stringify({
                    "grant_type": "authorization_code",
                    "code": req.session.auth_code,
                    "client_id": cli_id,
                    "client_secret": cli_secret,
                    "redirect_uri": "https://upcode-platform.herokuapp.com/"
                }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            request(getAuthorized, async function (error, response) {
                console.log("Infunction response " + response.body.substr(49, 40) + " ")
                req.session.access_token = response.body.substr(49, 40)
                console.log("Failed message " + response.body)
                const update = async () => {
                    const update_record = await Authentication.findOneAndUpdate({ name: req.session.user }, {
                        $set: {
                            Access_token: req.session.access_token
                        }
                        // user.Access_token=req.session.access_token;
                    })
                }
                await update();
                console.log("Access token in function => " + req.session.access_token);
            })

            res.render("home", {
                challenges: chal,
                logged_in: true
            })
        }
        else if (req.session.authenticated) {
            res.render("home", {
                challenges: chal,
                logged_in: req.session.authenticated
            })
        }
        else {
            res.render("home", {
                challenges: chal,
                logged_in: false
            })
        }
    })

})



app.get('/login', (req, res) => {
    if (req.session.authenticated) {
        Challenge.find({}, function (err, chal) {
            res.render("home", {
                challenges: chal,
                logged_in: req.session.authenticated
            })
        })
    }
    else {
        res.render('login', {
            exists: true,
            from_challenge: false
        })
    }
})

app.post('/login', async (req, res) => {
    const check_user = async () => {
        const query = await Authentication.find({ name: req.body.username })
        var obj_len = Object.keys(query).length
        if (obj_len) {
            var valid = await bcrypt.compare(req.body.pass, query[0].password);
            if (valid) {
                req.session.authenticated = true;
                console.log("Username input " + req.body.username)
                req.session.user = req.body.username
                res.redirect("https://api.codechef.com/oauth/authorize?response_type=code&client_id={your_client_id}&state=xyz&redirect_uri=https://upcode-platform.herokuapp.com/")
                // Challenge.find({}, function (err, chal) {
                //     res.render("home", {
                //         challenges: chal
                //     })
                // })
            }
            else {
                res.render('login', {
                    exists: false,
                    from_challenge: false

                });
            }
        }
        else {
            res.render('login', {
                exists: false,
                from_challenge: false
            });
        }
    }
    await check_user()
})

app.get('/signup', (req, res) => {
    if (req.session.authenticated) {
        res.render('/')
    }
    res.render('signup', {
        exists: false,
        success: false
    })
})
app.post('/signup', async (req, res) => {

    const check = async () => {
        const query = await Authentication.find({ name: req.body.username })
        var obj_len = Object.keys(query).length
        console.log("Return length  " + obj_len)
        if (obj_len == 0) {
            const salt = await bcrypt.genSalt();
            const hashed_pass = await bcrypt.hash(req.body.pass, salt)
            const new_user = new Authentication({
                name: req.body.username,
                password: hashed_pass,
                codechef_profile: req.body.codechef,
                codeforces_profile: req.body.codeforces,
                Access_token: ""
            })
            new_user.save();
            res.render("signup", {
                exists: false,
                success: true
            })
        }
        else {
            res.render('signup', {
                exists: true,
                success: false
            });
        }
    }
    await check()
})
app.get('/create', (req, res) => {
    // res.sendFile(path.join(__dirname, '/views/static/create.html'));
    if (req.session.authenticated) {

        res.render('create', {
            submitted: false,
            logged_in: true,
            exists:false
        })
    }
    else {
        res.render('login', {
            exists: true,
            from_challenge: false
        })
    }
})
app.post('/create', (req, res) => {
    if (!req.session.authenticated) {
        res.render('login', {
            exists: true,
            from_challenge: false
        })
    }
    //LINK VALIDATION 
    


    const end_date = new Date();
    end_date.setDate(end_date.getDate() + parseInt(req.body.duration))
    Challenge.exists({ link: req.body.link }, function (err, exists) {
        if (!exists) {
            console.log("Lenght of the found object" +  " " + exists )
            const challenge = new Challenge({
                creator: req.session.user,
                problem_name: req.body.problem,
                platform: req.body.platform,
                duration: end_date,
                link: req.body.link,
                completed: Object
            })
            challenge.save();
            res.render('create', {
                posted: true,
                submitted: true,
                logged_in: true,
                exists:false
            })
        }
        else{
            console.log("Lenght of the found object in else " + exists)
            res.render('create', {
                posted: true,
                submitted: false,
                logged_in: true,
                exists:true
            })   
        }
    })
})
app.get('/challenge/:chalng', async (req, res) => {
    if (!req.session.authenticated) {
        res.render('login', {
            exists: true,
            from_challenge: true
        })
    }
    const display_challenge = async () => {
        if (req.query.code == undefined) {
            const chal = await Challenge.find({ problem_name: req.params.chalng })
            var submitted = false, posted;
            for (const user of chal[0].completed) {
                if (user == req.session.user) {
                    posted = true;
                    submitted = true;
                    break;
                }
            }
            res.render("challenge", {
                prob_name: chal[0].problem_name,
                creator: chal[0].creator,
                platform: chal[0].platform,
                duration: chal[0].duration,
                link: chal[0].link,
                posted: posted,
                submitted: submitted,
                logged_in: true
            })
        }

    }
    await display_challenge()
})
app.post('/challenge/:chalng', async (req, res) => {
    const display_challenge = async () => {
        var submitted = false;
        const chal = await Challenge.find({ problem_name: req.params.chalng })
        const get_profile = await Authentication.find({ name: req.session.user })
        if (chal[0].platform == "Codeforces") {
            console.log("Queried data " + chal[0].problem_name)
            fetch('https://codeforces.com/api/user.status?handle=' + get_profile[0].codeforces_profile + '&from=1&count=100')
                .then(res => res.json())
                .then(async (submission_details) => {
                    for (let i = 0; i <= 100; i++) {
                        if (submission_details.result[i].problem.name == chal[0].problem_name && submission_details.result[i].verdict == "OK") {
                            submitted = true;
                            const add_to_submitted = await Challenge.findOneAndUpdate({ problem_name: chal[0].problem_name }, {
                                $push: {
                                    completed: req.session.user
                                }
                            })
                            break;
                        }
                    }
                    console.log("Submitted value " + submitted)
                    if (submitted) {
                        res.render("challenge", {
                            prob_name: chal[0].problem_name,
                            creator: chal[0].creator,
                            platform: chal[0].platform,
                            duration: chal[0].duration,
                            link:chal[0].link,
                            posted: true,
                            submitted: true,
                            logged_in: true
                        })

                    }
                    else {
                        res.render("challenge", {
                            prob_name: chal[0].problem_name,
                            creator: chal[0].creator,
                            platform: chal[0].platform,
                            duration: chal[0].duration,
                            link:chal[0].link,
                            posted: true,
                            submitted: false,
                            logged_in: true
                        })
                    }
                })

        }
        else if (chal[0].platform == "Codechef") {
            Authentication.findOne({ name: req.session.user }, function (err, user) {
                console.log("User object returned in challenge  " + user.Access_token);
                req.session.access_token = user.Access_token;

            })
            fetch('https://api.codechef.com/submissions/?result=AC&year=2022&username=' + get_profile[0].codechef_profile + '&problemCode=' + chal[0].problem_name, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + get_profile[0].Access_token
                },
            })
                .then((response) => response.json())
                .then(async (data) => {
                    console.log("Data returned " + JSON.stringify(data));
                    var status_code = data.result.data.code;
                    if (status_code == 9001) {
                        submitted = true;
                        const add_to_submitted = await Challenge.findOneAndUpdate({ problem_name: chal[0].problem_name }, {
                            $push: {
                                completed: req.session.user
                            }
                        })
                    }
                    else {
                        submitted = false;
                    }
                    if (submitted) {
                        res.render("challenge", {
                            prob_name: chal[0].problem_name,
                            creator: chal[0].creator,
                            platform: chal[0].platform,
                            duration: chal[0].duration,
                            link:chal[0].link,
                            posted: true,
                            submitted: true,
                            logged_in: true

                        })
                    }
                    else {
                        res.render("challenge", {
                            prob_name: chal[0].problem_name,
                            creator: chal[0].creator,
                            platform: chal[0].platform,
                            link:chal[0].link,
                            duration: chal[0].duration,
                            posted: true,
                            submitted: false,
                            logged_in: true
                        })
                    }
                })
                .catch(err => console.log("Error report " + " " + req.session.access_token + err));
        }
    }
    await display_challenge();
    const fetch_profilename = async () => {
        const get_profile = await Authentication.find({ name: req.session.username })
    }
})
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')

})
app.listen(port, () => {
})  
