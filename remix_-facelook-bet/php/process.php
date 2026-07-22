<?php
require_once __DIR__ . '/config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Function to generate unique IDs
function generateUuid() {
    return 'id-' . bin2hex(random_bytes(8));
}

// Redirect back with toast notification helper
function redirectBack($toastMessage, $toastType = 'success') {
    $_SESSION['toast'] = [
        'message' => $toastMessage,
        'type' => $toastType
    ];
    header('Location: index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = readDatabase();

    switch ($action) {
        case 'login':
            $emailOrPhone = $_POST['email_or_phone'] ?? '';
            $password = $_POST['password'] ?? '';
            
            // Allow any input as long as it's not completely empty (simulating authentication for XAMPP demo)
            if (!empty($emailOrPhone) && !empty($password)) {
                $_SESSION['user'] = [
                    'name' => 'Collins Dnego (You)',
                    'email' => $emailOrPhone
                ];
                header('Location: index.php');
                exit();
            } else {
                redirectBack('Please provide valid credentials.', 'error');
            }
            break;

        case 'login_google':
            // Simulating Google OAuth login
            $_SESSION['user'] = [
                'name' => 'Collins Dnego (You)',
                'email' => 'auth@google.com'
            ];
            header('Location: index.php');
            exit();
            break;

        case 'forgot_password':
            $term = $_POST['search_term'] ?? '';
            if (!empty($term)) {
                $_SESSION['toast'] = [
                    'message' => 'A password reset link has been sent to ' . htmlspecialchars($term),
                    'type' => 'success'
                ];
                header('Location: login.php');
                exit();
            } else {
                $_SESSION['toast'] = [
                    'message' => 'Please enter an email or phone number.',
                    'type' => 'error'
                ];
                header('Location: forgot-password.php');
                exit();
            }
            break;

        case 'deposit':
            $amount = floatval($_POST['amount'] ?? 0);
            if ($amount <= 0) {
                redirectBack('Please enter a valid deposit amount.', 'error');
            }
            $db['wallet']['balance'] += $amount;
            $db['wallet']['transactions'][] = [
                'id' => generateUuid(),
                'type' => 'deposit',
                'amount' => $amount,
                'time' => 'Just now',
                'target' => 'Deposit'
            ];
            writeDatabase($db);
            redirectBack('$' . number_format($amount, 2) . ' successfully deposited to your wallet!', 'success');
            break;

        case 'withdraw':
            $amount = floatval($_POST['amount'] ?? 0);
            if ($amount <= 0) {
                redirectBack('Please enter a valid withdrawal amount.', 'error');
            }
            if ($db['wallet']['balance'] < $amount) {
                redirectBack('Insufficient wallet balance to withdraw.', 'error');
            }
            $db['wallet']['balance'] -= $amount;
            $db['wallet']['transactions'][] = [
                'id' => generateUuid(),
                'type' => 'withdraw',
                'amount' => $amount,
                'time' => 'Just now',
                'target' => 'Withdrawal'
            ];
            writeDatabase($db);
            redirectBack('$' . number_format($amount, 2) . ' successfully withdrawn to your account.', 'success');
            break;

        case 'create_collab':
            $matchId = $_POST['match_id'] ?? '';
            $selectedOutcome = $_POST['selected_outcome'] ?? '1'; // 1, X, 2
            $targetMode = $_POST['target_mode'] ?? 'proposed'; // proposed or op
            $formulationMode = $_POST['formulation_mode'] ?? 'total_pool'; // total_pool or single_side
            $targetTotalStakeInput = floatval($_POST['target_total_stake'] ?? 100);
            $creatorStake = floatval($_POST['creator_stake'] ?? 20);
            $readyToMerge = isset($_POST['ready_to_merge']) ? true : false;

            // Find match
            $selectedMatch = null;
            foreach ($db['matches'] as $m) {
                if ($m['id'] === $matchId) {
                    $selectedMatch = $m;
                    break;
                }
            }
            if (!$selectedMatch) {
                redirectBack('Match details not found.', 'error');
            }

            // Calculation target stakes
            $remainingSymbols = array_filter(['1', 'X', '2'], function($sym) use ($selectedOutcome) {
                return $sym !== $selectedOutcome;
            });
            $remainingSymbols = array_values($remainingSymbols);

            $targets = getCollabTargets($formulationMode, $selectedMatch, $selectedOutcome, 1, $remainingSymbols[0], $targetTotalStakeInput);

            // If Optionalized Odd (OP) Mode: we must evaluate both outcomes and hold the HIGHEST group stake
            if ($targetMode === 'op') {
                $targets1 = getCollabTargets($formulationMode, $selectedMatch, $selectedOutcome, 1, $remainingSymbols[0], $targetTotalStakeInput);
                $targets2 = getCollabTargets($formulationMode, $selectedMatch, $selectedOutcome, 1, $remainingSymbols[1], $targetTotalStakeInput);
                
                if ($targets1['targetStakeCreator'] > $targets2['targetStakeCreator']) {
                    $targets = $targets1;
                } else {
                    $targets = $targets2;
                }
            }

            if ($creatorStake > $targets['targetStakeCreator']) {
                redirectBack('Your starting stake ($' . number_format($creatorStake, 2) . ') cannot exceed the calculated group target of $' . number_format($targets['targetStakeCreator'], 2), 'error');
            }

            if ($db['wallet']['balance'] < $creatorStake) {
                redirectBack('Insufficient wallet balance to stake $' . number_format($creatorStake, 2), 'error');
            }

            // Deduct funds
            $db['wallet']['balance'] -= $creatorStake;
            $db['wallet']['transactions'][] = [
                'id' => generateUuid(),
                'type' => 'bet_stake',
                'amount' => $creatorStake,
                'time' => 'Just now',
                'target' => 'Collaborative Pool Stake (' . $selectedMatch['homeTeam'] . ')'
            ];

            // Odds display text
            $oddLabel = 'Home';
            if ($selectedOutcome === 'X') $oddLabel = 'Draw';
            if ($selectedOutcome === '2') $oddLabel = 'Away';
            $selectedOddsVal = $selectedMatch['odds'][$selectedOutcome] ?? 2.0;

            // Create new collaborative pool
            $newCollab = [
                'id' => 'collab-' . time(),
                'matchName' => $selectedMatch['homeTeam'] . ' vs ' . $selectedMatch['awayTeam'],
                'prediction' => $oddLabel . ' (' . $selectedOutcome . ')',
                'odds' => $selectedOddsVal,
                'targetTotalStake' => $targets['targetTotalStake'],
                'currentTotalStake' => $creatorStake,
                'creator' => 'Collins Dnego (You)',
                'contributors' => [
                    ['name' => 'Collins Dnego (You)', 'stake' => $creatorStake]
                ],
                'status' => 'collecting',
                'numOpponents' => 1,
                'opponents' => [],
                'targetMode' => $targetMode,
                'selectedOutcome' => $selectedOutcome,
                'formulationMode' => $formulationMode,
                'targetStakeCreator' => $targets['targetStakeCreator'],
                'currentStakeCreator' => $creatorStake,
                'readyToMerge' => $readyToMerge
            ];

            $db['collab_challenges'][] = $newCollab;
            writeDatabase($db);
            redirectBack('Collaborative Escrow Pool successfully initialized!', 'success');
            break;

        case 'support_collab':
            $collabId = $_POST['collab_id'] ?? '';
            $amount = floatval($_POST['amount'] ?? 0);

            if ($amount <= 0) {
                redirectBack('Please enter a valid support contribution.', 'error');
            }

            $collabIndex = -1;
            for ($i = 0; $i < count($db['collab_challenges']); $i++) {
                if ($db['collab_challenges'][$i]['id'] === $collabId) {
                    $collabIndex = $i;
                    break;
                }
            }

            if ($collabIndex === -1) {
                redirectBack('Collaborative pool not found.', 'error');
            }

            $collab = $db['collab_challenges'][$collabIndex];
            $targetCreator = $collab['targetStakeCreator'] ?? $collab['targetTotalStake'];
            $currentCreator = $collab['currentStakeCreator'] ?? $collab['currentTotalStake'];
            $remaining = max(0, $targetCreator - $currentCreator);
            $actualAmount = min($amount, $remaining);

            if ($actualAmount <= 0) {
                redirectBack('This collaboration pool target has already been fully completed!', 'info');
            }

            if ($db['wallet']['balance'] < $actualAmount) {
                redirectBack('Insufficient wallet balance to add $' . number_format($actualAmount, 2), 'error');
            }

            // Deduct funds
            $db['wallet']['balance'] -= $actualAmount;
            $db['wallet']['transactions'][] = [
                'id' => generateUuid(),
                'type' => 'bet_stake',
                'amount' => $actualAmount,
                'time' => 'Just now',
                'target' => 'Pool Support: ' . $collab['matchName']
            ];

            // Update contributors
            $foundContrib = false;
            for ($c = 0; $c < count($collab['contributors']); $c++) {
                if ($collab['contributors'][$c]['name'] === 'Collins Dnego (You)') {
                    $collab['contributors'][$c]['stake'] += $actualAmount;
                    $foundContrib = true;
                    break;
                }
            }
            if (!$foundContrib) {
                $collab['contributors'][] = ['name' => 'Collins Dnego (You)', 'stake' => $actualAmount];
            }

            $collab['currentTotalStake'] += $actualAmount;
            $collab['currentStakeCreator'] = ($collab['currentStakeCreator'] ?? 0) + $actualAmount;

            // Mark completed if goal reached
            if ($collab['currentTotalStake'] >= $collab['targetTotalStake'] || $collab['currentStakeCreator'] >= $collab['targetStakeCreator']) {
                $collab['status'] = 'posted';
            }

            $db['collab_challenges'][$collabIndex] = $collab;
            writeDatabase($db);
            redirectBack('Funds successfully supported! Top-up of $' . number_format($actualAmount, 2) . ' applied.', 'success');
            break;

        case 'merge_collabs':
            $targetId = $_POST['target_id'] ?? '';
            $sourceId = $_POST['source_id'] ?? '';

            if ($targetId === $sourceId) {
                redirectBack('Cannot merge a collaboration pool with itself.', 'error');
            }

            $targetIndex = -1;
            $sourceIndex = -1;

            for ($i = 0; $i < count($db['collab_challenges']); $i++) {
                if ($db['collab_challenges'][$i]['id'] === $targetId) $targetIndex = $i;
                if ($db['collab_challenges'][$i]['id'] === $sourceId) $sourceIndex = $i;
            }

            if ($targetIndex === -1 || $sourceIndex === -1) {
                redirectBack('Pools to merge could not be located.', 'error');
            }

            $targetPool = $db['collab_challenges'][$targetIndex];
            $sourcePool = $db['collab_challenges'][$sourceIndex];

            // Combine contributors
            $combinedContributors = $targetPool['contributors'];
            $extraStake = 0;

            foreach ($sourcePool['contributors'] as $sc) {
                $found = false;
                for ($tc = 0; $tc < count($combinedContributors); $tc++) {
                    if ($combinedContributors[$tc]['name'] === $sc['name']) {
                        $combinedContributors[$tc]['stake'] += $sc['stake'];
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $combinedContributors[] = $sc;
                }
                $extraStake += $sc['stake'];
            }

            $newTotal = $targetPool['currentTotalStake'] + $extraStake;
            $newCreatorTotal = ($targetPool['currentStakeCreator'] ?? 0) + $extraStake;

            $targetPool['contributors'] = $combinedContributors;
            $targetPool['currentTotalStake'] = $newTotal;
            $targetPool['currentStakeCreator'] = $newCreatorTotal;

            if ($targetPool['currentTotalStake'] >= $targetPool['targetTotalStake'] || $targetPool['currentStakeCreator'] >= $targetPool['targetStakeCreator']) {
                $targetPool['status'] = 'posted';
            }

            // Remove source pool
            array_splice($db['collab_challenges'], $sourceIndex, 1);
            
            // Because index changed, find the new index of target and update
            for ($k = 0; $k < count($db['collab_challenges']); $k++) {
                if ($db['collab_challenges'][$k]['id'] === $targetId) {
                    $db['collab_challenges'][$k] = $targetPool;
                    break;
                }
            }

            writeDatabase($db);
            redirectBack('Success! Selected collaborative pools have been merged successfully.', 'success');
            break;

        case 'add_post':
            $content = trim($_POST['content'] ?? '');
            if (empty($content)) {
                redirectBack('Post content cannot be empty.', 'error');
            }

            $mediaPath = '';
            if (isset($_FILES['media']) && $_FILES['media']['error'] === UPLOAD_ERR_OK) {
                $fileTmp = $_FILES['media']['tmp_name'];
                $fileName = time() . '_' . basename($_FILES['media']['name']);
                $uploadPath = UPLOAD_DIR . $fileName;

                if (move_uploaded_file($fileTmp, $uploadPath)) {
                    $mediaPath = 'uploads/' . $fileName;
                }
            }

            $newPost = [
                'id' => 'post-' . time(),
                'author' => 'Collins Dnego (You)',
                'avatar' => 'CD',
                'time' => 'Just now',
                'content' => $content,
                'likes' => 0,
                'comments' => [],
                'media' => $mediaPath
            ];

            array_unshift($db['posts'], $newPost);
            writeDatabase($db);
            redirectBack('You shared a new banter post!', 'success');
            break;

        case 'add_comment':
            $postId = $_POST['post_id'] ?? '';
            $commentText = trim($_POST['comment'] ?? '');

            if (empty($commentText)) {
                redirectBack('Comment content cannot be empty.', 'error');
            }

            for ($i = 0; $i < count($db['posts']); $i++) {
                if ($db['posts'][$i]['id'] === $postId) {
                    $db['posts'][$i]['comments'][] = [
                        'author' => 'Collins Dnego (You)',
                        'content' => $commentText,
                        'time' => 'Just now'
                    ];
                    break;
                }
            }

            writeDatabase($db);
            redirectBack('Comment posted successfully!', 'success');
            break;

        case 'like_post':
            $postId = $_POST['post_id'] ?? '';
            for ($i = 0; $i < count($db['posts']); $i++) {
                if ($db['posts'][$i]['id'] === $postId) {
                    $db['posts'][$i]['likes']++;
                    break;
                }
            }
            writeDatabase($db);
            redirectBack('Liked post!', 'success');
            break;
    }
} else {
    // GET actions
    if ($action === 'logout') {
        session_destroy();
        header('Location: login.php');
        exit();
    }
    
    if ($action === 'reset') {
        if (file_exists(DB_FILE)) {
            unlink(DB_FILE);
        }
        redirectBack('Database cleared and reset to initial state!', 'success');
    }
}
