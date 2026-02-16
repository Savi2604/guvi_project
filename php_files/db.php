<?php

$mysql_conn = new mysqli("localhost", "root", "123456", "guvi_project_db");
if ($mysql_conn->connect_error) { 
    die(json_encode(["status" => "error", "message" => "MySQL Connection Failed"])); 
}


try {
    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379);
} catch (Exception $e) {
    
    die(json_encode(["status" => "error", "message" => "Redis Server Not Running"]));
}


require __DIR__ . '/../vendor/autoload.php'; 

try {
    $mongo_client = new MongoDB\Client("mongodb://localhost:27017");
    
    $profile_db = $mongo_client->guvi_project_db->profiles;
} catch (Exception $e) {
    die(json_encode(["status" => "error", "message" => "MongoDB Connection Error"]));
}
?>