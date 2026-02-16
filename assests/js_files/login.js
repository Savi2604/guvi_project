$(document).ready(function() {
    // Strictly No Form Submit - Button Click Only
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

    // 1. VERY STRICT Email Regex - Only allows @gmail.com
    // Idhu "@gmail.co" illa ".c" mistakes-ah alert moolama thadukkum
    // Oru letter miss aanaalum alert trigger aagum
    let strictGmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
    
    if (!strictGmailRegex.test(email)) {
        alert("Error: Strictly only @gmail.com addresses are allowed!");
        msgDiv.text("Only @gmail.com is allowed").css("color", "red");
        return; // Validation fail aana process stop aagum
    }

    // 2. AJAX POST Request - Sending data as JSON
    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                // 3. Token Refresh Logic
                // Pazhaya session-ah clear pannittu fresh token set panrom
                localStorage.clear(); 
                
                // Server-la irundhu token vandha mattum dhaan store pannum
                if(response.token) {
                    localStorage.setItem("token", response.token); 
                    localStorage.setItem("userEmail", email);
                    
                    console.log("New Token Generated: ", response.token); // Debugging-ku
                    alert("Login Successful! New Token Generated.");
                    window.location.href = "profile.html";
                } else {
                    // Idhu unga "Token not generated" prachinaiyai identify panna help pannum
                    alert("Server Error: Token not generated in login.php response.");
                }
            } else {
                // Invalid credentials alert
                alert(response.message);
                msgDiv.text(response.message).css("color", "red");
            }
        },
        error: function() {
            alert("Fatal Error: Could not reach login.php. Check your AWS server path.");
        }
    });
}