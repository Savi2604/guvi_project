$(document).ready(function() {
    $("#registerBtn").click(function() {
        let email = $("#email").val();
        let password = $("#password").val();
        let errorDiv = $("#passwordError");
        let msgDiv = $("#msg");

        errorDiv.hide().text("");
        msgDiv.text("");

        if(!email || !password) {
            msgDiv.html("<span class='text-danger'>Please fill all fields!</span>");
            return;
        }

        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            errorDiv.text("Needs 8+ chars, Uppercase, Lowercase, Number & Symbol.").show();
            return;
        }

        $.ajax({
            url: 'php_files/register.php',
            type: 'POST',
            data: JSON.stringify({ email: email, password: password }),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                // Inga dhaan neenga kaeta maadhiri function maathirukkaen
                if(response.trim() == "success") {
                    window.location.href = "login.html"; 
                } else {
                    $("#msg").html(response);
                }
            },
            error: function() {
                msgDiv.html("<span class='text-danger'>Server Error!</span>");
            }
        });
    });
});