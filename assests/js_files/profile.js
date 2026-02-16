$(document).ready(function() {
    let email = localStorage.getItem("userEmail");
    let token = localStorage.getItem("token"); // Dynamic Token fetch
    let base64Image = ""; 

    // 1. Session Check (Redirect to login if token is missing)
    if(!email || !token) {
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    $("#user_email_display").text(email);

    // 2. Fetch Existing Data (Using view_profile.php as per your folder)
    // Strictly JQuery AJAX POST for security and token verification
    $.ajax({
        url: 'php_files/view_profile.php', // Path updated here
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, token: token }),
        success: function(res) {
            if(res && res.status === 'success') {
                // Name fetch logic - MongoDB-la irundhu fullName fetch aagum
                $("#fullName").val(res.data.fullName || res.data.name); 
                $("#age").val(res.data.age);
                $("#dob").val(res.data.dob);
                $("#contact").val(res.data.contact);
                
                if(res.data.image) {
                    $("#preview").attr("src", res.data.image);
                    base64Image = res.data.image; 
                }
            }
        },
        error: function() {
            // Error handle: Session expired or file not found
            console.log("Error: Profile data could not be reached. Check view_profile.php path.");
        }
    });

    // 3. Image Preview Logic
    $("#imageInput").change(function() {
        let file = this.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                base64Image = e.target.result; 
                $("#preview").attr("src", base64Image); 
            };
            reader.readAsDataURL(file);
        }
    });

    // 4. Update Action (Strictly JQuery AJAX - No Form Tag)
    $("#updateBtn").click(function() {
        // Email validation check before update
        let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Invalid session. Please login again.");
            return;
        }

        let profileData = {
            email: email,
            token: token, // Refresh aana dynamic token
            fullName: $("#fullName").val(), 
            age: $("#age").val(),
            dob: $("#dob").val(),
            contact: $("#contact").val(),
            image: base64Image 
        };

        $.ajax({
            url: 'php_files/profile.php', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(profileData),
            success: function(response) { 
                alert("Profile and Name Updated Successfully!");
                $("#msg").text("Update Successful!").css("color", "green");
            },
            error: function() {
                alert("Update failed. Check AWS server logs.");
                $("#msg").text("Update Failed!").css("color", "red");
            }
        });
    });

    // 5. Navigation to Display Details
    $("#viewProfileBtn").click(function() {
        let currentName = $("#fullName").val();
        if(!currentName) {
            alert("Please update your name first!");
        } else {
            // Redirect to display.html to see final details
            window.location.href = "display.html"; 
        }
    });
});

// 6. Logout Function (Clear session security)
function logout() {
    localStorage.clear(); 
    window.location.href = "login.html";
}