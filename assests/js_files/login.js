$(document).ready(function() {
    $("#loginBtn").click(function(e) {
        e.preventDefault(); // Extra safety: Form submit-ah block pannum
        submitLogin();
    });
});

function submitLogin() {
    let email = $("#login_email").val().trim();
    let password = $("#login_password").val().trim();
    let msgDiv = $("#msg");

    msgDiv.text("");

    // 1. STRICT @gmail.com Check
    let gmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        alert("Error: Only @gmail.com addresses are allowed!");
        return;
    }

    $.ajax({
        url: 'php_files/login.php', 
        type: 'POST',
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            console.log("Server Response:", response); // Console-la token varudhaa nu check panna

            if(response.status === "success") {
                // IMPORTANT: Clear panradhuku badhula, direct-aa overwrite pannunga
                // Idhu dhaan missing token issue-ah fix pannum
                if(response.token) {
                    localStorage.setItem("token", response.token); 
                    localStorage.setItem("userEmail", email);
                    
                    alert("Login Successful!");
                    window.location.href = "profile.html"; 
                } else {
                    alert("Server Error: Token not found in response.");
                }
            } else {
                alert(response.message || "Invalid Credentials"); 
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", status, error);
            alert("Fatal Error: Server-ah reach panna mudiyala. Check AWS IP or Path.");
        }
    });
}