$(document).ready(function() {
    let email = localStorage.getItem("userEmail");
    let token = localStorage.getItem("token"); // Token fetch panninom
    let base64Image = ""; 

    // 1. Session Check (Token irukka-nu check pannanum)
    if(!email || !token) {
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    $("#user_email_display").text(email);

    // 2. Fetch Existing Data from MongoDB (Strictly AJAX)
    // GET request-kku badhula POST use pannuvom security-kaga (Token verification)
    $.ajax({
        url: 'php_files/get_profile.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, token: token }),
        success: function(res) {
            if(res && res.status === 'success') {
                // Name fetch logic fixed
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
            console.log("Error: Could not reach profile data. Token might be expired.");
        }
    });

    // 3. Image Preview Logic (Requirement: Keep it simple)
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
        let profileData = {
            email: email,
            token: token, // Sending token for verification
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
                alert("Profile Updated in MongoDB Successfully!");
                $("#msg").text("Update Successful!").css("color", "green");
            },
            error: function() {
                alert("Error updating profile. Check server logs.");
                $("#msg").text("Update Failed!").css("color", "red");
            }
        });
    });

    // 5. View Profile Details Fix (Shows Name in alert or display)
    $("#viewProfileBtn").click(function() {
        let currentName = $("#fullName").val();
        if(!currentName) {
            alert("Please update your profile name first!");
        } else {
            // Requirement-padi display.html-ku redirect pannalam
            window.location.href = "display.html"; 
        }
    });
});

// 6. Logout Function (Clears Token and Email)
function logout() {
    localStorage.clear(); // Entirely clear local storage for security
    window.location.href = "login.html";
}