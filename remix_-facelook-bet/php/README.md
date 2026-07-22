# 🐘 FaceLook Bet - XAMPP PHP Executable Portal

This directory contains a complete, high-fidelity, and fully responsive translation of the **FaceLook Bet** application from React/TypeScript into native PHP. It is structured to run directly on local host servers like **XAMPP**, **MAMP**, or **WampServer** without any compilation or package dependencies.

---

## 🚀 Quick Start Guide (XAMPP & VS Code)

### 1. Copy the Code into XAMPP
1. Locate your XAMPP installation folder (usually `C:\xampp` on Windows or `/Applications/XAMPP` on macOS).
2. Open the `htdocs` directory inside XAMPP.
3. Create a new folder named `facelook-bet` inside `htdocs`.
4. Copy all files from this `php/` directory (e.g., `index.php`, `config.php`, `process.php`) into that newly created `facelook-bet` folder.

### 2. Launch Apache Server
1. Open the **XAMPP Control Panel**.
2. Click the **Start** button next to the **Apache** service. (MySQL is not required, as this application uses a lightweight, highly efficient JSON-based flat file database `database.json` to store your wallets, pools, and feed comments persistently!).

### 3. Open in VS Code & Execute
1. Open Visual Studio Code.
2. Go to **File > Open Folder...** and select `C:\xampp\htdocs\facelook-bet`.
3. Open your favorite web browser and navigate to:
   ```
   http://localhost/facelook-bet/
   ```

---

## 🛠️ Main Features Implemented

### 0. Authentication System
- Dedicated Facebook-style login page (`login.php`).
- Support for Mock Email/Phone Authentication and Mock Google OAuth.
- Password recovery simulation (`forgot-password.php`).
- Session-based protection for the main app (`index.php`).

### 1. PostgreSQL & Postman API Setup (NEW!)
I highly recommend **PostgreSQL** for this project because of its strong support for structured relational data, transactions (critical for escrow wallets/betting), and complex spatial/JSON queries.
I have added everything you need to connect to your PostgreSQL database and test it using Postman.

**How to set up PostgreSQL:**
1. Open pgAdmin or your PostgreSQL CLI.
2. Create a new database: `CREATE DATABASE facelook_bet;`
3. Open `php/db_pg.php` in VS Code and update `DB_USER` and `DB_PASS` with your PostgreSQL credentials.
4. Run the setup script in your browser to automatically build all tables and seed mock data:
   `http://localhost/php/setup_pg.php`

**How to test with Postman:**
All APIs are routed through `api.php`.
- **Check Status (GET):** `http://localhost/php/api.php?endpoint=status`
- **Get Users (GET):** `http://localhost/php/api.php?endpoint=users`
- **Get Posts (GET):** `http://localhost/php/api.php?endpoint=posts`
- **Create Post (POST):** `http://localhost/php/api.php?endpoint=posts`
  - Body -> raw -> JSON:
    ```json
    {
      "user_id": "id-u1",
      "content": "Testing API creation from Postman!"
    }
    ```

### 1. Group Target Balance Scanning
- Click on any Live Match Odd to populate the **Escrow Formulator** calculator.
- Toggling **Ready to Merge Teams** disables the standard initialize button, unlocking the **Tolerance Merge Input**.
- Enter an individual stake amount and specify a **+/- Merge Tolerance (e.g., 7)**.
- The system automatically scans active pools matching the selected match and prediction, displaying only those that have balances to fill their total group stake within the tolerance range.
- Shows the exact lacked amount for each matched pool (e.g., `"Lacking: $60.00"`). Click **Merge & Join** to automatically fulfill their goals and merge teams!

### 2. Optionalized Market Odds (OP Mode)
- Evaluates both opposing outcomes simultaneously and locks the highest possible group stake target.
- Full real-time preview showing both cases side-by-side.
- Simulates proportionate wallet refunds in the transaction history if the lower opponent odd is selected.

### 3. Support & Top-up Mechanics
- Quick **Support +$20** actions to inject funds into active pools.
- **Merge forces** actions to manually combine similar groups.

### 4. Interactive Banking Wallet
- Fully functional deposit and withdrawal simulator.
- Logged transaction ledger tracking deposits, withdrawals, and escrow stakes.

### 5. Social Feed, Deep Search & AI Recommendation
- Compose custom banter posts, like, and reply with comments.
- **Media Uploads:** Directly attach Photos or Videos (`.mp4`) from your local device utilizing native PHP file-handling algorithms.
- **Go Live:** Visual integration for Live Video feeds.
- **BFS Deep Search:** A global search bar implementing Breadth-First-Search concepts to deeply scan through teams, people, users, and schedules, extracting alerts to the top of the feed.
- **Algorithmic Feed Engine (Heaps/Stacks):** Evaluates a post's relevancy dynamically. Posts with many likes and those containing System Alerts jump to the top using a simulated priority heap score algorithm!
- Fully interactive **Star AI Chat Expert** assisting you on odds, merge tolerances, and betting rules!
