<?php
include 'db.php'; 
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $email = $_GET['email'] ?? '';
    $userProfile = $profile_db->findOne(['email' => $email]);
    
    if ($userProfile) {
        echo json_encode([
            'status' => 'success',
            'age' => $userProfile['age'] ?? '',
            'dob' => $userProfile['dob'] ?? '',
            'contact' => $userProfile['contact'] ?? '',
            'image' => $userProfile['image'] ?? '' // Image fetch aagum
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No profile found']);
    }

} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!empty($data['email'])) {
        $updateData = [
            'age' => $data['age'],
            'dob' => $data['dob'],
            'contact' => $data['contact']
        ];

        
        if(!empty($data['image'])){
            $updateData['image'] = $data['image'];
        }

        $profile_db->updateOne(
            ['email' => $data['email']],
            ['$set' => $updateData],
            ['upsert' => true] 
        );
        echo json_encode(['status' => 'success']);
    }
}
?>