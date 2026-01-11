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
            url: 'php_folder/register.php',
            type: 'POST',
            data: JSON.stringify({ email: email, password: password }),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if(response && response.status === 'success') {
                    alert(response.message); 
                    window.location.href = "login.html"; 
                } else {
                    msgDiv.html("<span class='text-danger'>" + response.message + "</span>");
                }
            },
            error: function() {
                msgDiv.html("<span class='text-danger'>Server Error!</span>");
            }
        });
    });
});