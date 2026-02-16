$(document).ready(function() {
    $("#loginBtn").click(function() {
        submitLogin();
    });
});

function submitLogin() {
    let email = $("#login_email").val().trim();
    let password = $("#login_password").val().trim();
    let msgDiv = $("#msg");

    // 1. Strict @gmail.com Check
    let gmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        alert("Error: Only @gmail.com is allowed!");
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
                // 2. DYNAMIC TOKEN REFRESH logic
                // Pazhaya token-ah kandaipaa clear panniட்டு fresh-aa start panrom
                localStorage.clear(); 
                
                // Backend (login.php) anupura NEW token-ah ippo store panrom
                if(response.token) {
                    localStorage.setItem("token", response.token); 
                    localStorage.setItem("userEmail", email);
                    
                    console.log("New Token Generated: ", response.token); // Debugging-ku
                    alert("Login Successful! New Token Generated.");
                    window.location.href = "display.html"; // Profile detail-ku redirect
                } else {
                    alert("Server Error: Token was not generated in login.php!");
                }
            } else {
                alert(response.message); // Invalid credentials logic
            }
        },
        error: function() {
            alert("Fatal Error: Could not reach server. Check AWS connection.");
        }
    });
}