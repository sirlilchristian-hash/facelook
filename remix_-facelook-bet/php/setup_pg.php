<?php
/**
 * PostgreSQL Database Setup Script
 * Run this file once in your browser (http://localhost/php/setup_pg.php) 
 * to automatically generate tables and seed initial data.
 */

require_once __DIR__ . '/db_pg.php';

try {
    $pdo = getPgConnection();
    echo "<h3>PostgreSQL Connection Successful!</h3>";

    // 1. Create Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        wallet_balance DECIMAL(10,2) DEFAULT 0.00
    )");
    echo "<p>✓ Users table created.</p>";

    // 2. Create Matches Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(50) PRIMARY KEY,
        home_team VARCHAR(100) NOT NULL,
        away_team VARCHAR(100) NOT NULL,
        league VARCHAR(100),
        status VARCHAR(20),
        match_time VARCHAR(50),
        score VARCHAR(20),
        odds_1 DECIMAL(5,2),
        odds_x DECIMAL(5,2),
        odds_2 DECIMAL(5,2),
        sport VARCHAR(50)
    )");
    echo "<p>✓ Matches table created.</p>";

    // 3. Create Posts Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id),
        content TEXT NOT NULL,
        media_url VARCHAR(255),
        likes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "<p>✓ Posts table created.</p>";

    // 4. Create Collaborative Pools Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS collab_pools (
        id VARCHAR(50) PRIMARY KEY,
        match_id VARCHAR(50) REFERENCES matches(id),
        creator_id VARCHAR(50) REFERENCES users(id),
        prediction VARCHAR(50) NOT NULL,
        odds DECIMAL(5,2) NOT NULL,
        target_total_stake DECIMAL(10,2) NOT NULL,
        current_total_stake DECIMAL(10,2) DEFAULT 0.00,
        status VARCHAR(20) DEFAULT 'collecting'
    )");
    echo "<p>✓ Collaborative Pools table created.</p>";

    // 5. Seed Initial User Data
    $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, avatar, wallet_balance) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING");
    $stmt->execute(['id-u1', 'Collins Dnego (You)', 'collins@example.com', password_hash('password123', PASSWORD_DEFAULT), 'CD', 1500.00]);
    echo "<p>✓ Initial user seeded successfully.</p>";

    echo "<h2 style='color: green;'>✅ Database Setup Complete! You can now use Postman to interact with api.php</h2>";

} catch (Exception $e) {
    echo "<h3 style='color: red;'>Setup Error:</h3><p>" . $e->getMessage() . "</p>";
}
?>
