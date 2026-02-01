function submitLogin() {
    // Correct IDs matching the HTML
    let email = $("#login_email").val();
    let password = $("#login_password").val();
    let msgDiv = $("#msg");
    let loginError = $("#loginPasswordError");

    // Reset UI
    msgDiv.text("");
    loginError.hide().text("");

    // Regex for Raja@123 validation
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        loginError.text("Invalid Password format! Use Uppercase, Lowercase, Number & Symbol (Min 8).").show();
        return;
    }

    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(res) {
            if(res.status === 'success') {
                localStorage.setItem("userEmail", email);
                alert("Login Successful!");
                window.location.href = "profile.html";
            } else {
                msgDiv.text(res.message).css("color", "red");
            }
        },
        error: function() {
            msgDiv.text("Server Error! Check if php_files/login.php exists.").css("color", "red");
        }
    });
}