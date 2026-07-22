<?php
/**
 * RESTful API Entry Point for Postman
 * Usage: http://localhost/php/api.php?endpoint=users
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db_pg.php';

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? 'status';

try {
    $pdo = getPgConnection();

    switch ($endpoint) {
        case 'status':
            // Verify DB Connection
            echo json_encode([
                "status" => "success", 
                "message" => "API is running perfectly! PostgreSQL connected successfully.",
                "database" => DB_NAME
            ]);
            break;

        case 'users':
            if ($method === 'GET') {
                $stmt = $pdo->query("SELECT id, name, email, avatar, wallet_balance FROM users");
                echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
            }
            break;

        case 'posts':
            if ($method === 'GET') {
                $stmt = $pdo->query("
                    SELECT p.id, p.content, p.media_url, p.likes, p.created_at, u.name as author, u.avatar 
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id 
                    ORDER BY p.created_at DESC
                ");
                echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
            } elseif ($method === 'POST') {
                $data = json_decode(file_get_contents("php://input"), true);
                if (empty($data['content']) || empty($data['user_id'])) {
                    http_response_code(400);
                    echo json_encode(["status" => "error", "message" => "Missing 'content' or 'user_id' in JSON payload"]);
                    break;
                }
                
                $newId = 'post-' . time();
                $stmt = $pdo->prepare("INSERT INTO posts (id, user_id, content) VALUES (?, ?, ?)");
                $stmt->execute([$newId, $data['user_id'], $data['content']]);
                
                http_response_code(201);
                echo json_encode(["status" => "success", "message" => "Post created successfully", "post_id" => $newId]);
            }
            break;

        case 'pools':
            if ($method === 'GET') {
                $stmt = $pdo->query("SELECT * FROM collab_pools");
                echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Endpoint '$endpoint' not found"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Internal Server Error", 
        "details" => $e->getMessage()
    ]);
}
?>
