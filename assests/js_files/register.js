$(document).ready(function() {
    $("#registerBtn").click(function() {
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        let msgDiv = $("#msg");

        // UI-ah reset panrom
        msgDiv.text("");

        // 1. VERY STRICT @gmail.com Regex
        // Idhu "@gmail.co" illa vera endha domain-aiyum allow pannaadhu.
        // Exact-aa "@gmail.com" nu irundha mattum dhaan logic mela pogum.
        let gmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
        
        if (!gmailRegex.test(email)) {
            alert("Error: Strictly only @gmail.com addresses are allowed!");
            msgDiv.html("<span class='text-danger'>Please use a valid @gmail.com email.</span>");
            return; // Inga dhaan logic stop aagum, AJAX execute aagaadhu
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