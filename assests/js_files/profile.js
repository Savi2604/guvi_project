$(document).ready(function() {
    let email = localStorage.getItem("userEmail");
    let base64Image = ""; 

    // 1. Session Check
    if(!email) {
        window.location.href = "login.html";
        return;
    }

    $("#user_email_display").text(email);

    // 2. Fetch Existing Data
    $.get(`php_files/profile.php?email=${email}`, function(res) {
        if(res && res.status === 'success') {
            $("#fullName").val(res.name); // Added Name Fetch
            $("#age").val(res.age);
            $("#dob").val(res.dob);
            $("#contact").val(res.contact);
            
            if(res.image) {
                $("#preview").attr("src", res.image);
                base64Image = res.image; 
            }
        }
    }).fail(function() {
        console.log("Error: Could not reach profile.php. Check folder name.");
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

    // 4. Update Action (AJAX POST)
    $("#updateBtn").click(function() {
        let profileData = {
            email: email,
            name: $("#fullName").val(), // Added Name to payload
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
                alert("Profile and Image Updated in MongoDB!");
                $("#msg").text("Update Successful!").css("color", "green");
            },
            error: function() {
                alert("Error updating profile. Check if php_files/profile.php exists.");
                $("#msg").text("Update Failed!").css("color", "red");
            }
        });
    });

    // 5. Navigation
    $("#viewProfileBtn").click(function() {
        window.location.href = "display.html"; 
    });
});

// 6. Logout Function
function logout() {
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}