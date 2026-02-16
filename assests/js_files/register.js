$(document).ready(function() {
    $("#registerBtn").click(function() {
        let emailInput = document.getElementById("email");
        let passwordInput = document.getElementById("password");
        
        let email = $("#email").val();
        let password = $("#password").val();
        let errorDiv = $("#passwordError");
        let msgDiv = $("#msg");

        errorDiv.hide().text("");
        msgDiv.text("");

        // 1. Email Format Validation (HTML pattern logic-ah use pannudhu)
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        // 2. Empty Field Check
        if(!email || !password) {
            msgDiv.html("<span class='text-danger'>Please fill all fields!</span>");
            return;
        }

        // 3. Strong Password Validation (Min 8 chars, 1 Number, 1 Symbol)
        // Note: HTML-la namba potta pattern-ku match aavaen ippo idhu update panni irukaen.
        let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(password)) {
            errorDiv.text("Needs 8+ chars, 1 Number & 1 Symbol.").show();
            passwordInput.focus();
            return;
        }

        // AJAX call starts here
        $.ajax({
            url: 'php_files/register.php',
            type: 'POST',
            data: JSON.stringify({ email: email, password: password }),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if(response == "success" || response.status == "success") {
                    window.location.href = "login.html"; 
                } else {
                    $("#msg").html(response.message || response);
                }
            },
            error: function() {
                msgDiv.html("<span class='text-danger'>Server Error!</span>");
            }
        });
    });
});