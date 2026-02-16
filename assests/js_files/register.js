$(document).ready(function() {
    $("#registerBtn").click(function() {
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        let msgDiv = $("#msg");

        // UI-ah reset panrom
        msgDiv.text("");

        // 1. Strict Email Regex - Strictly JQuery validation (Not HTML)
        // Idhu dhaan "@gmail.co" illa ".c" mistakes-ah alert moolama thadukkum
        let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format! Example: user@gmail.com (Check if you missed @ or used .c)");
            msgDiv.html("<span class='text-danger'>Please enter a valid email.</span>");
            return; // Validation fail aana AJAX execute aagathu
        }

        // 2. Strong Password Validation
        let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            msgDiv.html("<span class='text-danger'>Password needs 8+ chars, 1 Number & 1 Symbol.</span>");
            return;
        }

        // 3. AJAX POST - Strictly No Form Tag
        $.ajax({
            url: 'php_files/register.php',
            type: 'POST',
            data: JSON.stringify({ email: email, password: password }),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if(response.status === "success") {
                    alert("Registration Successful!");
                    window.location.href = "login.html"; 
                } else {
                    msgDiv.html("<span class='text-danger'>" + response.message + "</span>");
                }
            },
            error: function() {
                msgDiv.html("<span class='text-danger'>Server Error! Check your DB connection.</span>");
            }
        });
    });
});