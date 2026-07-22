<?php
require_once __DIR__ . '/config.php';

if (isset($_SESSION['user'])) {
    header('Location: index.php');
    exit();
}

// Toast notifications
$toast = isset($_SESSION['toast']) ? $_SESSION['toast'] : null;
unset($_SESSION['toast']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FaceLook - log in or sign up</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .fb-logo { color: #1877f2; font-size: 3.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: -5px; }
        .fb-subtitle { font-size: 1.75rem; line-height: 2rem; color: #1c1e21; font-weight: 400; width: 500px; }
        .login-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1); width: 396px; padding: 20px; text-align: center; }
        .input-field { border: 1px solid #dddfe2; border-radius: 6px; padding: 14px 16px; font-size: 17px; width: 100%; margin-bottom: 12px; outline: none; }
        .input-field:focus { border-color: #1877f2; box-shadow: 0 0 0 2px #e7f3ff; }
        .login-btn { background-color: #1877f2; color: white; font-size: 20px; font-weight: 700; border-radius: 6px; padding: 10px 16px; width: 100%; border: none; cursor: pointer; transition: background-color 0.2s; }
        .login-btn:hover { background-color: #166fe5; }
        .forgot-link { color: #1877f2; font-size: 14px; text-decoration: none; margin-top: 15px; display: block; font-weight: 500; }
        .forgot-link:hover { text-decoration: underline; }
        .divider { border-bottom: 1px solid #dadde1; margin: 20px 0; }
        .create-btn { background-color: #42b72a; color: white; font-size: 17px; font-weight: 700; border-radius: 6px; padding: 10px 16px; border: none; cursor: pointer; transition: background-color 0.2s; display: inline-block; text-decoration: none; }
        .create-btn:hover { background-color: #36a420; }
        .google-btn { background-color: white; color: #3c4043; border: 1px solid #dadde1; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 10px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; margin-top: 15px; }
        .google-btn:hover { background-color: #f8f9fa; }
        @media (max-width: 1024px) {
            .fb-subtitle { width: auto; font-size: 1.5rem; }
            .login-card { width: 100%; max-width: 396px; margin: 0 auto; }
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center">
    
    <!-- Toast Notification -->
    <?php if ($toast): ?>
    <div id="toast" class="fixed top-5 right-5 z-50 flex items-center p-4 mb-4 text-sm rounded-lg shadow-xl transition-all duration-300 <?php echo $toast['type'] === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border border-red-200'; ?>">
        <span class="mr-2 font-black"><?php echo $toast['type'] === 'success' ? '✓' : '✗'; ?></span>
        <div class="font-semibold"><?php echo htmlspecialchars($toast['message']); ?></div>
        <button onclick="document.getElementById('toast').remove()" class="ml-4 font-bold opacity-70 hover:opacity-100">&times;</button>
    </div>
    <?php endif; ?>

    <div class="max-w-[980px] w-full mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        <!-- Left Side -->
        <div class="text-center lg:text-left pt-10 lg:pt-0 lg:mt-[-50px]">
            <h1 class="fb-logo">FaceLook</h1>
            <h2 class="fb-subtitle mt-4 hidden lg:block">Connect with friends and the world around you on FaceLook Bet.</h2>
        </div>

        <!-- Right Side -->
        <div class="flex flex-col items-center w-full lg:w-auto">
            <div class="login-card w-full">
                <form action="process.php?action=login" method="POST">
                    <input type="text" name="email_or_phone" placeholder="Email address or phone number" class="input-field" required>
                    <input type="password" name="password" placeholder="Password" class="input-field" required>
                    <button type="submit" class="login-btn">Log In</button>
                    <a href="forgot-password.php" class="forgot-link">Forgotten password?</a>
                    <div class="divider"></div>
                    <button type="button" class="create-btn">Create new account</button>
                </form>

                <form action="process.php?action=login_google" method="POST">
                    <button type="submit" class="google-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                            </g>
                        </svg>
                        Log in with Google
                    </button>
                </form>
            </div>
            <div class="mt-6 text-sm text-center">
                <a href="#" class="font-bold hover:underline">Create a Page</a> for a celebrity, brand or business.
            </div>
        </div>

    </div>
</body>
</html>
