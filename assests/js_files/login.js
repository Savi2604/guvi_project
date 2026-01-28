function submitLogin() {
    // 1. HTML-la irukira id correct-aa nu check pannunga (email/password vs login_email/login_password)
    let email = $("#email").val(); 
    let password = $("#password").val();
    let msgDiv = $("#msg");
    let loginError = $("#loginPasswordError");

    msgDiv.text("");
    loginError.hide().text("");

    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        loginError.text("Invalid Password format!").show();
        return;
    }

    $.ajax({
        url: 'php_files/login.php', // Corrected folder name based on your structure
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json', // JSON handling
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
            msgDiv.text("Server Error! Check login.php location.").css("color", "red");
        }
    });
}