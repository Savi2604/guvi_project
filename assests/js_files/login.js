$(document).ready(function() {
    // Button click moolama dhaan login aaganum (No Form Submit)
    $("#loginBtn").click(function() {
        submitLogin();
    });
});

function submitLogin() {
    let email = $("#login_email").val().trim();
    let password = $("#login_password").val().trim();
    let msgDiv = $("#msg");
    let loginError = $("#loginPasswordError");

    // Reset UI
    msgDiv.text("");
    loginError.hide().text("");

    // 1. Strict Email Regex Validation (Prevents .c errors)
    // Indha regex @gmail.com sariyaa illanalum, illa .c nu mudinjalo alert kudukkum.
    let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
        msgDiv.text("Invalid email format! Please use a proper domain (e.g., .com, .in)").css("color", "red");
        return;
    }

    // 2. Password Regex Validation
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        loginError.text("Invalid Password format! Use Uppercase, Lowercase, Number & Symbol (Min 8).").show();
        return;
    }

    // 3. AJAX Login Request (Purely JQuery AJAX)
    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                // 4. Proper Token Update Logic
                // Ovvoru vaati login pannumbodhum pazhaya session-ah clear pannanum
                localStorage.clear(); 

                // Store the NEW unique token received from PHP server
                localStorage.setItem("token", response.token); 
                localStorage.setItem("userEmail", email);

                console.log("New Token Set Successfully: ", response.token);
                
                alert("Login Successful!");
                window.location.href = "profile.html";
            } else {
                msgDiv.text(response.message).css("color", "red");
            }
        },
        error: function() {
            msgDiv.text("Server Error! Check if php_files/login.php exists.").css("color", "red");
        }
    });
}