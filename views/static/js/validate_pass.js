window.onload = function () {
    var platform = document.getElementById("platform");
    platform.addEventListener("change", function () {
        var button = document.getElementById("chal_button")
        button.disabled = true;
        if (platform.selectedIndex) {
            button.disabled = false;
        }
    })
}
function showValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
}

var validate = function () {
    if (document.getElementById("pass").value.length >= 8) {
        document.getElementById("signup").disabled = false;
        $("#alert2").hide();
    }
    if (document.getElementById("pass").value == document.getElementById("conf_pass").value) {
        document.getElementById("signup").disabled = false;
        console.log("Passwords match")
        $("#alert").hide();
    }
    else {
        console.log("Passwords do not match ");
        //   $("#show").show();
        if (document.getElementById("pass").value.length < 8) {
            $("#alert2").show();
        }
        else {
            $("#alert").show();
        }
        document.getElementById("signup").disabled = true;
    }
}

var null_validation = function () {
    var button = document.getElementById("chal_button");
    var platform = document.getElementById("platform");
    button.disabled = true;
    if (document.getElementById("problem").value.length > 1) {
        if (platform.selectedIndex) {
            button.disabled = false;
        }
    }
}
var link_validation = function () {
    $("#alert").show();
    var button = document.getElementById("chal_button");
    var link = document.getElementById("link");
    var problem = document.getElementById("problem").value;
    var list = document.getElementById("platform")
    var duration = document.getElementById("duration")
    button.disabled = true;
    var codechef = "https://www.codechef.com";
    var codeforces = "https://codeforces.com";
    var prob_link = link.value;
    if (link.value.substring(0, 22) == codeforces && list.options[list.selectedIndex].text == "Codeforces") {
        button.disabled = false;
        $("#alert").hide();
    }
    else if (prob_link.substring(0, 24) == codechef && prob_link.substr(prob_link.length - problem.length, problem.length) == problem
        && list.options[list.selectedIndex].text == "Codechef") {
        button.disabled = false;
        $("#alert").hide();
    }



}