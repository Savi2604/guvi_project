<?php
// PHP error reporting-ah enable pannuvom debugging-kku
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// db.php-la MongoDB connection ($profile_db) irukkannu confirm pannikonga
include 'db.php'; 

// 1. JS-la irundhu JSON payload receive pannuvom
$inputJSON = file_get_contents("php://input");
$data = json_decode($inputJSON, true);

// 2. Data extraction with safety
$email = $data['email'] ?? null;
$token = $data['token'] ?? null; 

// 3. Basic Validation
if (!$email) {
    echo json_encode(['status' => 'error', 'message' => 'Email missing from request!']);
    exit;
}

try {
    // 4. MongoDB-la irundhu profile fetch pannuvom
    // 'email' field unique-aa irukkum-nu findOne() use panrom
    $user_profile = $profile_db->findOne(['email' => $email]);

    if ($user_profile) {
        // Success response with data
        echo json_encode([
            'status' => 'success',
            'data' => [
                // FIX: Multiple keys-ah check pannuvom. 'N/A' nu varama irukka fallback logic.
                'name' => $user_profile['name'] ?? $user_profile['fullName'] ?? $user_profile['full_name'] ?? $user_profile['username'] ?? 'User Profile Found',
                'age' => $user_profile['age'] ?? 'N/A',
                'dob' => $user_profile['dob'] ?? 'N/A',
                'contact' => $user_profile['contact'] ?? 'N/A',
                'image' => $user_profile['image'] ?? 'https://via.placeholder.com/150'
            ]
        ]);
    } else {
        // Profile illana indha error return pannuvom
        echo json_encode(['status' => 'error', 'message' => 'Profile not found for: ' . $email]);
    }
} catch (Exception $e) {
    // MongoDB or connection errors handle panna
    echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>