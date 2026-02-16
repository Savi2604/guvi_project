$(document).ready(function() {
    // 100% Strictly JQuery Click Event
    $("#loginBtn").click(function() {
        submitLogin();
    });
});

function submitLogin() {
    let email = $("#login_email").val().trim();
    let password = $("#login_password").val().trim();
    let msgDiv = $("#msg");
    let loginError = $("#loginPasswordError");

    // UI Reset
    msgDiv.text("");
    loginError.hide().text("");

    // 1. Strict Email Regex Validation (Pure JQuery)
    // Idhu dhaan "@gmail.co" illa ".c" mistakes-ah alert moolama thadukkum
    let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Invalid email format! Example: user@gmail.com");
        msgDiv.text("Invalid format! (e.g., .com, .in)").css("color", "red");
        return; // Validation fail aana AJAX pogadhu
    }

    // 2. Strong Password Validation
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        loginError.text("Invalid Password format! Use Uppercase, Lowercase, Number & Symbol (Min 8).").show();
        return;
    }

    // 3. AJAX Login Request (Dynamic Token Refresh)
    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                // 4. Proper Token Refresh Logic
                // Pazhaya session-ah clear panniட்டு, backend-la irundhu vara NEW token-ah set panrom
                localStorage.clear(); 
                localStorage.setItem("token", response.token); 
                localStorage.setItem("userEmail", email);

                console.log("New Dynamic Token Set: ", response.token);
                
                alert("Login Successful!");
                window.location.href = "profile.html";
            } else {
                // Backend-la credentials match aagalana "Invalid Credentials" alert
                alert(response.message);
                msgDiv.text(response.message).css("color", "red");
            }
        },
        error: function() {
            msgDiv.text("Server Error! Check your PHP file path.").css("color", "red");
        }
    });
}