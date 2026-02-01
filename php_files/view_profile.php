<?php
header('Content-Type: application/json');
include 'db.php'; 

$email = $_POST['email']; 

try {
    
    $user_profile = $profile_db->findOne(['email' => $email]);

    if ($user_profile) {
        echo json_encode([
            'status' => 'success',
            'data' => [
                'age' => $user_profile['age'],
                'dob' => $user_profile['dob'],
                'contact' => $user_profile['contact']
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Profile not found']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>