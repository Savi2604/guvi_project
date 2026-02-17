<?php
include 'db.php';

ob_clean(); 
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? ''); // No strtolower here to maintain strictness
$password = $data['password'] ?? '';

// 1. Basic Empty Check
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required!']);
    exit;
}

// 2. STRICT GMAIL CHECK (Starts with a-z, strictly lowercase throughout)
if (!preg_match('/^[a-z][a-z0-9._%+-]*@gmail\.com$/', $email)) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Error: Email must start with a small letter and be strictly lowercase @gmail.com!'
    ]);
    exit;
}

// 3. Strong Password Validation
$regex = "/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/";
if (!preg_match($regex, $password)) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Password too weak!'
    ]);
    exit;
}

try {
    // MySQL Check
    $checkStmt = $mysql_conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'User already exists!']);
        exit;
    }

    // Insert into MySQL
    $stmt = $mysql_conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $password);
    $stmt->execute();

    // Insert into MongoDB (Profile)
    $profile_db->insertOne([
        'name' => $name,
        'email' => $email,
        'age' => 'N/A',
        'dob' => 'N/A',
        'contact' => 'N/A'
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Registration Successful!']);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . $e->getMessage()]);
}

$mysql_conn->close();
?>