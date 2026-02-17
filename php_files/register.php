<?php
include 'db.php';

ob_clean(); 
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
// Name ippo profile page-la venamnu sonnadhaala, inga email/pass mattum handle panrom
$email = trim($data['email'] ?? ''); 
$password = $data['password'] ?? '';

// 1. Basic Empty Check
if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and Password are required!']);
    exit;
}

// 2. STRICT GMAIL CHECK
if (!preg_match('/^[a-z][a-z0-9._%+-]*@gmail\.com$/', $email)) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Error: Email must start with a small letter and be lowercase @gmail.com!'
    ]);
    exit;
}

// 3. Strong Password Validation
$regex = "/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/";
if (!preg_match($regex, $password)) {
    echo json_encode(['status' => 'error', 'message' => 'Password too weak!']);
    exit;
}

try {
    // Check user exists
    $checkStmt = $mysql_conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'User already exists!']);
        exit;
    }

    // --- FIX INGA DHAAN ---
    // Neenga 2 fields (email, password) dhaan insert panreenga, so "ss" dhaan varaum
    $stmt = $mysql_conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $password); // "sss" maathi "ss" nu pottachu
    
    if ($stmt->execute()) {
        // MongoDB-la profile create pannuvom
        $profile_db->insertOne([
            'email' => $email,
            'name' => 'User', // Default-ah name 'User' nu vachukalam since profile-la name field illai
            'age' => 'N/A',
            'dob' => 'N/A',
            'contact' => 'N/A'
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Registration Successful!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'MySQL Execution Failed']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Server Error: ' . $e->getMessage()]);
}

$mysql_conn->close();
?>