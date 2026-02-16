$(document).ready(function() {
    $("#registerBtn").click(function() {
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        let msgDiv = $("#msg");

        msgDiv.text("");

        // Strict Email Format - Block mistakes like .c or missing @
        let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            msgDiv.html("<span class='text-danger'>Invalid Email! Use format like name@gmail.com</span>");
            return;
        }

        // Strong Password Validation
        let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            msgDiv.html("<span class='text-danger'>Password needs 8+ chars, 1 Number & 1 Symbol.</span>");
            return;
        }

        // AJAX POST - Strictly No Form Submit
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
            }
        });
    });
});