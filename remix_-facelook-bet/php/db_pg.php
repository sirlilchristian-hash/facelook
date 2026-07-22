<?php
// PostgreSQL Database Configuration for XAMPP/Local Environment
// Update these credentials matching your local PostgreSQL setup (e.g., pgAdmin)

define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'facelook_bet'); // Create this database in your PostgreSQL server
define('DB_USER', 'postgres');
define('DB_PASS', 'your_password_here'); // Change to your postgres password

/**
 * Get a PDO connection to PostgreSQL
 */
function getPgConnection() {
    try {
        $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        
        // Set PDO error mode to exception
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Set default fetch mode to associative array
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        
        return $pdo;
    } catch (PDOException $e) {
        die(json_encode([
            "status" => "error",
            "message" => "PostgreSQL Connection Failed: " . $e->getMessage(),
            "hint" => "Make sure PostgreSQL is running, the database '" . DB_NAME . "' exists, and credentials in db_pg.php are correct."
        ]));
    }
}
?>
