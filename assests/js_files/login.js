$(document).ready(function() {
    $("#loginBtn").click(function(e) {
        e.preventDefault(); 
        submitLogin();
    });
});

function submitLogin() {
    let email = $("#login_email").val().trim();
    let password = $("#login_password").val().trim();
    
    // 1. Gmail Validation
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
            console.log("Server Response:", response);

            if(response.status === "success") {
                if(response.token) {
                    // STEP 1: Conflict varaama irukka clear pannuvom
                    localStorage.removeItem("token");
                    localStorage.removeItem("userEmail");

                    // STEP 2: Fresh-aa set pannuvom
                    localStorage.setItem("token", response.token); 
                    localStorage.setItem("userEmail", email);
                    
                    // Console-la check panna
                    console.log("Storage Updated! Email: ", localStorage.getItem("userEmail"));

                    // STEP 3: Oru 200ms delay kuduthu redirect pannuvom
                    // Idhu browser storage register aaga time kudukkum
                    setTimeout(function() {
                        window.location.href = "profile.html"; 
                    }, 200);
                    
                } else {
                    alert("Server Error: Token not found in response.");
                }
            } else {
                alert(response.message || "Invalid Credentials"); 
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", status, error);
            alert("Fatal Error: Server-ah reach panna mudiyala.");
        }
    });
}