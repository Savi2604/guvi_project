<?php
header('Content-Type: application/json');
include 'db.php'; 

// 1. JSON data-ah JS-la irundhu receive panna idhu dhaan correct method
$data = json_decode(file_get_contents("php://input"), true);

// 2. Data-ah variables-la store pannuvom
$email = $data['email'] ?? null;
$token = $data['token'] ?? null; 

// 3. Basic Validation
if (!$email) {
    echo json_encode(['status' => 'error', 'message' => 'Email missing from request!']);
    exit;
}

try {
    // 4. MongoDB-la irundhu user profile fetch panradhu
    $user_profile = $profile_db->findOne(['email' => $email]);

    if ($user_profile) {
        // Success response with data
        echo json_encode([
            'status' => 'success',
            'data' => [
                // FIX: 'name' or 'fullName' or 'full_name' - edhu irundhaalum fetch pannum
                'name' => $user_profile['name'] ?? $user_profile['fullName'] ?? $user_profile['full_name'] ?? 'N/A',
                'age' => $user_profile['age'] ?? 'N/A',
                'dob' => $user_profile['dob'] ?? 'N/A',
                'contact' => $user_profile['contact'] ?? 'N/A',
                'image' => $user_profile['image'] ?? '' 
            ]
        ]);
    } else {
        // Profile illana indha error varum
        echo json_encode(['status' => 'error', 'message' => 'Profile not found for this email.']);
    }
} catch (Exception $e) {
    // Database connectivity issues handle panna
    echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>