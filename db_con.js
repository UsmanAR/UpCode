//const fetchit = require("node-fetch") 
const req = require("express/lib/request");
const mong=require("mongoose");
mong.connect("mongodb://localhost:27017/Test").
then(()=>console.log("..."))
.catch((err)=>console.log(err));
const fetch= require('node-fetch')
// Schema creation  
const auth =new mong.Schema({
    name:String,
    password:String,
    codechef_profile:String,
    codeforces_profile:String
})
// const Authentication = new mong.model("User",auth);
//     const check=async()=>{
//         var res= await Authentication.exists({name:"Usman AR"})
//         console.log("Availabilty "+ res);
//    } 
// const q =Authentication.where({name:"Usman AR"})
// q.findOne(function(err,user){
//     if(user)available = true
//     else available=false
// }

// )
// const chalng =new mong.Schema({
//     creator:String,
//     problem_name:String,
//     platform:String,
//     duration:Number,
//     message:String
// })
// const Challenge = new mong.model("Challenge",chalng);
// console.log(Challenge.find())

// const cf_details=async()=>{fetch("https://codeforces.com/api/user.status?handle=usman_ar&from=1&count=10");}
// const json=async()=>{cf_details.json()}

// fetch('https://codeforces.com/api/user.status?handle=usman_ar&from=1&count=100')
// .then(res=>res.json())
// .then((submission_details)=>{
//     for(let i=0;i<=100;i++){
//         if(submission_details.result[i].problem.name=="Casimir's String Solitaire"&&submission_details.result[i].verdict=="OK"){
//         submitted=true;console.log("ith iteration " + i + " " +submission_details.result[i].problem.name );break;
//         }
//     }
// })
//  const ans=Authentication.findOne({ name:"Usman AR" }).exec();

// ans.then(out=>console.log("Done "+ out.password))

// console.log("Availability of username " + available)
// var access_token="a55d92de693685a791bb5160be33ac108b4e58fc";
// fetch('https://api.codechef.com/submissions/?result=AC&year=2022&username=usman_shaikh&problemCode=GFTSHP', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         "Authorization" : "Bearer "+access_token

//                     },
//                    // body: JSON.stringify(data),
//                 })
//                     .then((response) => response.json())
//                     .then((data) => {
//                         console.log("Sucess : "+ JSON.stringify(data))
                        
//                     })
//                     .catch(err=> console.log("Error report " + err));
const date = new Date();
const end_date = new Date(2022,date.getMonth(),date.getDate()+15)
console.log("Present date and time is " + date.getDate())
date.setDate(date.getDate()+13)
console.log("Last submission date and time ---- " + date.getMonth())