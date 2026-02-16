<?php
include 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// 1. Backend Strict @gmail.com Check (Double Safety)
if (!preg_match("/^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/", $email)) {
    echo json_encode(['status' => 'error', 'message' => 'Only @gmail.com emails allowed!']);
    exit;
}

// 2. Database Credential Check
$stmt = $mysql_conn->prepare("SELECT id FROM users WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // 3. GENERATE NEW TOKEN ON EVERY LOGIN
    // Ovvoru vaatiyum unique-aa 32-character token generate aagum
    $token = bin2hex(random_bytes(16));
    
    // 4. Update Redis with New Token
    // Pazhaya token-ah idhu automatic-aa overwrite pannidum (3600s = 1 Hour)
    $redis->setex("session:$email", 3600, $token); 
    
    // JSON response-la pudhu token-ah anupuvom
    echo json_encode([
        'status' => 'success', 
        'token' => $token,
        'message' => 'New Dynamic Token Generated'
    ]);
} else {
    //
    echo json_encode(['status' => 'error', 'message' => 'Invalid Credentials']);
}
?>