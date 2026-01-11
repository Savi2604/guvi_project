$(document).ready(function() {
    let email = localStorage.getItem("userEmail");
    let base64Image = ""; 

    if(!email) {
        window.location.href = "login.html";
        return;
    }

    $("#user_email_display").text(email);

    
    $.get(`php_folder/profile.php?email=${email}`, function(res) {
        if(res && res.status === 'success') {
            
            $("#age").val(res.age);
            $("#dob").val(res.dob);
            $("#contact").val(res.contact);
            
            
            if(res.image) {
                $("#preview").attr("src", res.image);
                base64Image = res.image; 
            }
        }
    });

    
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

    
    $("#updateBtn").click(function() {
        let profileData = {
            email: email,
            age: $("#age").val(),
            dob: $("#dob").val(),
            contact: $("#contact").val(),
            image: base64Image 
        };

        $.ajax({
            url: 'php_folder/profile.php', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(profileData),
            success: function(response) { 
                alert("Profile and Image Updated in MongoDB!");
            },
            error: function() {
                alert("Error updating profile.");
            }
        });
    });

    
    $("#viewProfileBtn").click(function() {
        window.location.href = "display.html"; 
    });
});

function logout() {
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}