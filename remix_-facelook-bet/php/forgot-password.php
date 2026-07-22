<?php
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgotten Password | FaceLook</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #e9ebee; font-family: Helvetica, Arial, sans-serif; }
        .header { background-color: white; padding: 10px 0; border-bottom: 1px solid #ddd; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .fb-logo { color: #1877f2; font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; text-decoration: none; margin-left: 20px;}
        .card { background: white; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); max-width: 500px; margin: 40px auto; padding: 0; }
        .card-header { padding: 18px 20px; border-bottom: 1px solid #dddfe2; }
        .card-header h2 { font-size: 20px; font-weight: 700; color: #1c1e21; margin: 0; }
        .card-body { padding: 20px; }
        .card-body p { font-size: 17px; color: #1c1e21; margin-bottom: 20px; }
        .input-field { border: 1px solid #ccc; border-radius: 6px; padding: 14px 16px; font-size: 16px; width: 100%; outline: none; margin-bottom: 20px; }
        .input-field:focus { border-color: #1877f2; box-shadow: 0 0 0 2px #e7f3ff; }
        .card-footer { padding: 15px 20px; background-color: #f5f6f7; border-top: 1px solid #dddfe2; text-align: right; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
        .btn-cancel { background-color: #e4e6eb; color: #4b4f56; font-size: 15px; font-weight: 600; padding: 8px 20px; border-radius: 6px; text-decoration: none; display: inline-block; margin-right: 8px; border: 1px solid #ccd0d5; }
        .btn-cancel:hover { background-color: #d8dadf; }
        .btn-search { background-color: #1877f2; color: white; font-size: 15px; font-weight: 600; padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; }
        .btn-search:hover { background-color: #166fe5; }
    </style>
</head>
<body>
    <div class="header">
        <div class="max-w-[980px] mx-auto px-4 flex justify-between items-center">
            <a href="login.php" class="fb-logo">FaceLook</a>
            <div>
                <form action="process.php?action=login" method="POST" class="flex gap-2">
                    <input type="text" name="email_or_phone" placeholder="Email or phone" class="border border-gray-300 p-1.5 px-3 text-sm rounded outline-none focus:border-blue-500" required>
                    <input type="password" name="password" placeholder="Password" class="border border-gray-300 p-1.5 px-3 text-sm rounded outline-none focus:border-blue-500" required>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-1.5 rounded transition-colors">Log In</button>
                </form>
            </div>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header">
            <h2>Find Your Account</h2>
        </div>
        <form action="process.php?action=forgot_password" method="POST">
            <div class="card-body">
                <p>Please enter your email address or mobile number to search for your account.</p>
                <input type="text" name="search_term" class="input-field" placeholder="Email address or mobile number" required>
            </div>
            <div class="card-footer">
                <a href="login.php" class="btn-cancel">Cancel</a>
                <button type="submit" class="btn-search">Search</button>
            </div>
        </form>
    </div>
</body>
</html>
