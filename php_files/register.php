<?php
include 'db.php';

ob_clean(); 
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and Password are required!']);
    exit;
}

$regex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";

if (!preg_match($regex, $password)) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Password too weak! Must have 8+ chars, Uppercase, Lowercase, Number and Special character.'
    ]);
    exit;
}

try {
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
if ($success) {
    header("Location: ../login.html");
    exit();
}

$mysql_conn->close();
?>