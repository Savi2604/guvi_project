<?php
include 'db.php';

ob_clean(); 
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

// 1. Basic Empty Check
if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and Password are required!']);
    exit;
}

// 2. STRICT GMAIL CHECK (Matching your requirement)
if (!preg_match('/^[a-z0-9._%+-]+@gmail\.com$/', $email)) {
    echo json_encode(['status' => 'error', 'message' => 'Error: Strictly only @gmail.com addresses are allowed!']);
    exit;
}

// 3. Strong Password Validation
$regex = "/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/";
if (!preg_match($regex, $password)) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Password too weak! Needs 8+ chars, 1 Number and 1 Special character.'
    ]);
    exit;
}

try {
    // User already exists check
    $checkStmt = $mysql_conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'User already exists!']);
        $checkStmt->close();
        exit;
    }
    $checkStmt->close();

    // Insert new user
    $stmt = $mysql_conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $password);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Registration Successful!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Execution failed.']);
    }
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . $e->getMessage()]);
}

$mysql_conn->close();
?>