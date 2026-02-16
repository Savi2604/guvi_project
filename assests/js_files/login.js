function submitLogin() {
    let email = $("#login_email").val();
    let password = $("#login_password").val();
    let msgDiv = $("#msg");
    let loginError = $("#loginPasswordError");

    // Reset UI
    msgDiv.text("");
    loginError.hide().text("");

    // 1. Password Regex Validation
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        loginError.text("Invalid Password format! Use Uppercase, Lowercase, Number & Symbol (Min 8).").show();
        return;
    }

    // 2. AJAX Login Request
    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                // 3. Proper Token Update Logic
                // First, clear any old session data
                localStorage.clear(); 

                // Store the NEW unique token from server
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