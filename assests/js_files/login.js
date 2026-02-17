$(document).ready(function() {
    // Input-la enter key adichaalum login aagura maadhiri
    $("#login_password").keypress(function(e) {
        if(e.which == 13) {
            submitLogin();
        }
    });
});

function submitLogin() {
    // MUKKIAM: trim() and toLowerCase() to match registration data
    let rawEmail = $("#login_email").val().trim();
    let email = rawEmail.toLowerCase(); 
    let password = $("#login_password").val().trim();
    
    // 1. Strict Email Check (Starts with a-z and ends with @gmail.com)
    let gmailRegex = /^[a-z][a-z0-9._%+-]*@gmail\.com$/;
    
    if (!gmailRegex.test(email)) {
        alert("Error: Email must start with a small letter and end with @gmail.com!");
        return;
    }

    if (password === "") {
        alert("Please enter your password!");
        return;
    }

    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                if(response.token) {
                    // Previous session-ah clear pannuvom
                    localStorage.clear();

                    // Fresh data-va store pannuvom
                    localStorage.setItem("token", response.token); 
                    localStorage.setItem("userEmail", email); // Storing lowercase email
                    
                    console.log("Login Success! Storage Updated.");

                    // Small delay for browser storage to register
                    setTimeout(function() {
                        window.location.href = "profile.html"; 
                    }, 200);
                    
                } else {
                    alert("Server Error: Token missing!");
                }
            } else {
                alert(response.message || "Invalid Credentials"); 
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", status, error);
            alert("Fatal Error: Cannot reach the server.");
        }
    });
}