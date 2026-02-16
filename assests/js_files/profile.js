$(document).ready(function() {
    let email = localStorage.getItem("userEmail");
    let token = localStorage.getItem("token"); // Dynamic Token fetch panninom
    let base64Image = ""; 

    // 1. Session Check (Token and Email check)
    if(!email || !token) {
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    $("#user_email_display").text(email);

    // 2. Fetch Existing Data (Using your file: view_profile.php)
    // Strictly JQuery AJAX POST
    $.ajax({
        url: 'php_files/view_profile.php', // URL maathiyaachu
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, token: token }),
        success: function(res) {
            if(res && res.status === 'success') {
                // Name fetch logic fixed for Display
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
            // Profile details fetch aagala-na token expire aayirukkum
            console.log("Error: Token expired or view_profile.php not reachable.");
        }
    });

    // 3. Image Preview Logic (Simple FileReader)
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

    // 4. Update Action (Strictly JQuery AJAX - No Form)
    $("#updateBtn").click(function() {
        // Email format check once again before update
        let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Session email is invalid. Please login again.");
            return;
        }

        let profileData = {
            email: email,
            token: token, // Refresh aana pudhu token
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
                alert("Update failed. Check your AWS server logs.");
                $("#msg").text("Update Failed!").css("color", "red");
            }
        });
    });

    // 5. Navigation to Display Page
    $("#viewProfileBtn").click(function() {
        let currentName = $("#fullName").val();
        if(!currentName) {
            alert("Update your name first to see it in profile details!");
        } else {
            // Redirects to display.html where name will be shown
            window.location.href = "display.html"; 
        }
    });
});

// 6. Logout Function (Security: Clear all storage)
function logout() {
    localStorage.clear(); 
    window.location.href = "login.html";
}