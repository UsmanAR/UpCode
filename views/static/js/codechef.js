// // https://api.codechef.com/oauth/authorize?response_type=code&client_id=d92637ff93ad5e0b6b00767b25787e25&state=xyz&redirect_uri=http://localhost:3000/

// function codechef_auth(){

// fetch("https://api.codechef.com/oauth/authorize?response_type=code&client_id=d92637ff93ad5e0b6b00767b25787e25&state=xyz&redirect_uri=http://localhost:3000/").then(function(response) {
//     return response.json();
//   }).then(function(data) {
//     console.log(data);
//   }).catch(function() {
//     console.log("Booo");
//   });
// }
function callit(){
window.location.href="https://api.codechef.com/oauth/authorize?response_type=code&client_id=d92637ff93ad5e0b6b00767b25787e25&state=xyz&redirect_uri=http://localhost:3000/"
}