<?php
header('Content-Type: application/json');
include 'db.php'; 

$inputJSON = file_get_contents("php://input");
$data = json_decode($inputJSON, true);
$email = $data['email'] ?? null;

if (!$email) {
    echo json_encode(['status' => 'error', 'message' => 'Email missing!']);
    exit;
}

try {
    $user_profile = $profile_db->findOne(['email' => $email]);

    if ($user_profile) {
        // --- NAME KEY DISCOVERY ---
        $foundName = 'N/A';
        
        // MongoDB-la neenga oru vaelai 'fullname', 'Name', illa 'fname' nu save panniyirukkalaam
        // Inga irukka list-la illadha field-ah kooda idhu catch pannum
        $possibleKeys = ['name', 'fullName', 'full_name', 'username', 'user_name', 'fname', 'fullname', 'Name', 'FullName'];
        
        foreach ($possibleKeys as $key) {
            if (isset($user_profile[$key]) && !empty($user_profile[$key])) {
                $foundName = $user_profile[$key];
                break;
            }
        }

        echo json_encode([
            'status' => 'success',
            'data' => [
                'name' => $foundName,
                'age' => $user_profile['age'] ?? 'N/A',
                'dob' => $user_profile['dob'] ?? 'N/A',
                'contact' => $user_profile['contact'] ?? 'N/A',
                'image' => $user_profile['image'] ?? 'https://via.placeholder.com/150'
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Profile not found']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>