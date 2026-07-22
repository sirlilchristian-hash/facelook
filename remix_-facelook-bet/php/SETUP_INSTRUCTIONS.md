# FaceLook Bet - Local Environment Setup Guide

Here is the complete list of tools you need and the exact step-by-step procedure to get your PHP application, PostgreSQL database, and Postman API running locally.

## 🛠️ Required Tools

You will need to download and install the following free tools if you don't have them already:

1. **XAMPP** (or WAMP/MAMP)
   * **Why:** Provides the local Apache server and PHP environment to run your code.
   * **Download:** https://www.apachefriends.org/

2. **PostgreSQL & pgAdmin**
   * **Why:** PostgreSQL is the robust relational database we selected. pgAdmin is the visual interface to manage your databases.
   * **Download:** https://www.postgresql.org/download/ (Usually includes pgAdmin by default).

3. **Postman**
   * **Why:** To test your RESTful API endpoints (`api.php`) directly without needing the frontend UI.
   * **Download:** https://www.postman.com/downloads/

4. **Visual Studio Code (VS Code)**
   * **Why:** To edit your PHP files, specifically to connect your database credentials.
   * **Download:** https://code.visualstudio.com/

---

## 📋 Step-by-Step Procedure

### Phase 1: File Extraction & XAMPP Setup
1. **Download the ZIP** from this AI Studio project (using the export option).
2. **Extract the ZIP** to your computer.
3. Open the extracted folder, locate the `php` folder.
4. **Copy the `php` folder** and paste it into your XAMPP's public directory:
   * Windows: `C:\xampp\htdocs\`
   * Mac: `/Applications/XAMPP/htdocs/`
5. Rename the copied folder from `php` to `facelook_bet`.
6. Open the **XAMPP Control Panel** and click **Start** next to **Apache**. *(You do NOT need to start MySQL since we are using PostgreSQL).*

### Phase 2: PostgreSQL Database Setup
1. Open **pgAdmin** (search for it in your Start menu/Applications) and log in with the master password you created during installation.
2. In the left sidebar, expand **Servers** -> **PostgreSQL**.
3. Right-click on **Databases** -> **Create** -> **Database...**
4. In the "Database" name field, type exactly: `facelook_bet`
5. Click **Save**.

### Phase 3: Connect the Code to the Database
1. Open **VS Code**.
2. Go to **File > Open Folder** and select the folder you created in XAMPP: `C:\xampp\htdocs\facelook_bet`
3. In VS Code, open the file named `db_pg.php`.
4. Look for this line: 
   `define('DB_PASS', 'your_password_here');`
5. Change `'your_password_here'` to the actual password you set for PostgreSQL. Save the file (Ctrl+S).

### Phase 4: Automatic Table Creation & App Launch
1. Open your web browser (Chrome/Edge/Firefox).
2. Navigate to the setup script: 
   👉 `http://localhost/facelook_bet/setup_pg.php`
3. You should see a green success message saying **"Database Setup Complete!"** The PHP script just automatically created all your users, matches, pools, and posts tables.
4. Now, navigate to the main app:
   👉 `http://localhost/facelook_bet/login.php`
5. You can now log in and use the app!

### Phase 5: Testing APIs with Postman
1. Open **Postman**.
2. Click the **"+"** button to create a new Request.
3. Set the method to **GET** (the dropdown next to the URL bar).
4. Enter the URL to test the database connection status:
   👉 `http://localhost/facelook_bet/api.php?endpoint=status`
5. Click **Send**.
6. You should see a JSON response at the bottom saying `"API is running perfectly!"`.
7. **To test getting users**, change the URL to:
   👉 `http://localhost/facelook_bet/api.php?endpoint=users` and click Send.
