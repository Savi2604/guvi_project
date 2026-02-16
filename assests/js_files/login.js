$(document).ready(function() {
    // Strictly button click handling, avoiding form refresh
    $("#loginBtn").click(function() {
        submitLogin();
    });
});

function submitLogin() {
    let email = $("#login_email").val().trim();
    let password = $("#login_password").val().trim();
    let msgDiv = $("#msg");

    // UI Reset
    msgDiv.text("");

    // 1. VERY STRICT @gmail.com Check
    // Idhu .co, .c, illa vera endha domain-aiyum allow pannaadhu
    let gmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        alert("Error: Only @gmail.com addresses are allowed!");
        return; // Validation fail aana AJAX execute aagaadhu
    }

    // 2. AJAX POST Request with JSON Body
    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                // 3. DYNAMIC TOKEN REFRESH logic
                // Pazhaya session data-ah clear panniட்டு fresh-aa start panrom
                localStorage.clear(); 
                
                // Backend-la pudhusa generate aana token-ah store panrom
                if(response.token) {
                    localStorage.setItem("token", response.token); 
                    localStorage.setItem("userEmail", email);
                    
                    console.log("New Token Generated: ", response.token); // Debugging-ku
                    alert("Login Successful! New Token Generated.");
                    
                    // Directing to display.html with the fresh token
                    window.location.href = "display.html"; 
                } else {
                    alert("Server Error: Login successful but token not found in response.");
                }
            } else {
                // Invalid credentials alert
                alert(response.message); 
            }
        },
        error: function() {
            alert("Fatal Error: Could not reach login.php. Check your AWS server path.");
        }
    });
}