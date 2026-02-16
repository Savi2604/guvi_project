$(document).ready(function() {
    $("#loginBtn").click(function() {
        submitLogin();
    });
});

function submitLogin() {
    let email = $("#login_email").val().trim();
    let password = $("#login_password").val().trim();
    let msgDiv = $("#msg");

    // 1. VERY STRICT Email Regex - Only allows @gmail.com
    // Idhu .co, .c, illa vera endha domain-aiyum allow pannaadhu
    let strictGmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
    
    if (!strictGmailRegex.test(email)) {
        alert("Error: Only @gmail.com addresses are allowed!");
        msgDiv.text("Strictly use @gmail.com format").css("color", "red");
        return; // Inga dhaan process stop aagum
    }

    // 2. AJAX POST Request
    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                // Token refresh logic
                localStorage.clear(); 
                
                // Server-la irundhu token vandha mattum dhaan set pannum
                if(response.token) {
                    localStorage.setItem("token", response.token); 
                    localStorage.setItem("userEmail", email);
                    alert("Login Successful! New Token Generated.");
                    window.location.href = "profile.html";
                } else {
                    alert("Server Error: Token not generated. Check login.php logic.");
                }
            } else {
                alert(response.message); // "Invalid Credentials" alert
            }
        },
        error: function() {
            alert("Fatal Error: Could not reach login.php. Check your AWS server.");
        }
    });
}