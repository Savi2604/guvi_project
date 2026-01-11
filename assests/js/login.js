function submitLogin() {
    let email = $("#login_email").val();
    let password = $("#login_password").val();
    let msgDiv = $("#msg");
    let loginError = $("#loginPasswordError");

    // Reset UI
    msgDiv.text("");
    loginError.hide().text("");

    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        loginError.text("Invalid Password format! Check requirements.").show();
        return;
    }

    $.ajax({
        url: 'php_folder/login.php',
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        success: function(res) {
            if(res.status === 'success') {
                localStorage.setItem("userEmail", email);
                alert("Login Successful!");
                window.location.href = "profile.html";
            } else {
                msgDiv.text(res.message).addClass("text-danger");
            }
        },
        error: function() {
            msgDiv.text("Server Error! Check XAMPP.").addClass("text-danger");
        }
    });
}