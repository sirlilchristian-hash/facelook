<?php
require_once __DIR__ . '/config.php';

// Check authentication
if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit();
}

// Load persistent database
$db = readDatabase();
$wallet = $db['wallet'];
$matches = $db['matches'];
$collabChallenges = $db['collab_challenges'];
$posts = $db['posts'];

// --- DEEP SEARCH & FEED RECOMMENDATION ALGORITHM (BFS/Heaps simulation) ---
$searchQuery = strtolower(trim($_GET['q'] ?? ''));

if (!empty($searchQuery)) {
    // Simulate BFS deep search for Teams, People, and Matches
    $filteredPosts = [];
    foreach ($posts as $p) {
        if (strpos(strtolower($p['author']), $searchQuery) !== false || 
            strpos(strtolower($p['content']), $searchQuery) !== false) {
            $filteredPosts[] = $p;
        }
    }
    
    // Also search matches and prepend them as system alert posts to feed
    foreach ($matches as $m) {
        if (strpos(strtolower($m['homeTeam']), $searchQuery) !== false || 
            strpos(strtolower($m['awayTeam']), $searchQuery) !== false || 
            strpos(strtolower($m['league']), $searchQuery) !== false) {
            
            array_unshift($filteredPosts, [
                'id' => 'alert-' . $m['id'],
                'author' => 'System Alert (Deep Search)',
                'avatar' => '🤖',
                'time' => 'Just now',
                'content' => "Found Match: {$m['homeTeam']} vs {$m['awayTeam']} ({$m['league']}). Status: LIVE",
                'likes' => 999,
                'comments' => [],
                'media' => ''
            ]);
        }
    }
    $posts = $filteredPosts;
}

// Implement Feed Recommendation Heap Sort
// Score = (Likes * 10) + (Reverse Index to simulate recency)
foreach ($posts as $index => &$post) {
    $recencyScore = count($posts) - $index;
    $post['_heap_score'] = ($post['likes'] * 10) + $recencyScore;
    if (strpos($post['author'], 'System Alert') !== false) {
        $post['_heap_score'] += 10000; // Alerts always on top
    }
}
unset($post);

// Sort array based on the calculated heap score (Descending)
usort($posts, function($a, $b) {
    return $b['_heap_score'] <=> $a['_heap_score'];
});
// --------------------------------------------------------------------------

// Toast notifications
$toast = isset($_SESSION['toast']) ? $_SESSION['toast'] : null;
unset($_SESSION['toast']);
?>
<!DOCTYPE html>
<html lang="en" class="h-full bg-gray-50 dark:bg-[#0f1011]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FaceLook Bet - XAMPP PHP Portal</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="h-full font-sans text-gray-900 dark:text-gray-100 antialiased">

    <!-- Toast Notification -->
    <?php if ($toast): ?>
    <div id="toast" class="fixed top-5 right-5 z-50 flex items-center p-4 mb-4 text-sm rounded-2xl shadow-xl transition-all duration-300 translate-y-0 opacity-100 <?php echo $toast['type'] === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300'; ?>">
        <span class="mr-2 font-black"><?php echo $toast['type'] === 'success' ? '✓' : '✗'; ?></span>
        <div class="font-semibold"><?php echo htmlspecialchars($toast['message']); ?></div>
        <button onclick="document.getElementById('toast').remove()" class="ml-4 font-bold opacity-70 hover:opacity-100">&times;</button>
    </div>
    <script>
        setTimeout(() => {
            const t = document.getElementById('toast');
            if (t) {
                t.style.opacity = '0';
                setTimeout(() => t.remove(), 300);
            }
        }, 4000);
    </script>
    <?php endif; ?>

    <!-- Navigation Header -->
    <nav class="bg-white dark:bg-[#151618] border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-40 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <span class="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-1.5">
                        <span>🤝</span> FaceLook Bet <span class="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-mono py-0.5 px-2 rounded-full uppercase font-black">PHP Local</span>
                    </span>
                </div>
                
                <!-- Global Search Box -->
                <div class="hidden md:flex flex-1 mx-8 justify-center">
                    <form action="index.php" method="GET" class="w-full max-w-md relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input type="text" name="q" placeholder="Deep Search people, teams, matches (BFS algorithm)..." class="block w-full pl-9 pr-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-full leading-5 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 sm:text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" value="<?php echo htmlspecialchars($_GET['q'] ?? ''); ?>">
                    </form>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Current Wallet Balance Card -->
                    <div class="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 p-1.5 px-3 rounded-xl border border-gray-200 dark:border-zinc-800">
                        <div class="text-left">
                            <span class="block text-[8px] uppercase tracking-wider font-extrabold text-gray-400 font-mono">Personal Wallet</span>
                            <span class="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">$<?php echo number_format($wallet['balance'], 2); ?></span>
                        </div>
                        <a href="#wallet" class="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-2.5 py-1 rounded-lg transition-all shadow-xs">
                            Topup
                        </a>
                    </div>

                    <!-- Reset Database Button -->
                    <form action="process.php?action=reset" method="POST" onsubmit="return confirm('Are you sure you want to reset the database?');">
                        <button type="submit" class="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:text-gray-400 text-[10px] font-black p-2 px-3 rounded-lg border border-gray-250 dark:border-zinc-700 transition-all cursor-pointer">
                            ↻ Reset Data
                        </button>
                    </form>

                    <a href="process.php?action=logout" class="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-[10px] font-black p-2 px-3 rounded-lg border border-gray-250 dark:border-zinc-700 transition-all cursor-pointer">
                        Log Out
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Workspace -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <!-- Banner Alert: XAMPP Executable info -->
        <div class="p-4 bg-blue-50/70 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-900/30 flex items-start gap-3">
            <span class="text-lg">💡</span>
            <div>
                <h4 class="text-xs font-bold text-blue-900 dark:text-blue-300">Run Anywhere - XAMPP & VS Code Compatible</h4>
                <p class="text-[11px] text-blue-700 dark:text-blue-400/80 leading-normal mt-0.5">
                    This folder is a fully self-contained PHP translation of the React betting application. Place the <code>php/</code> folder inside your XAMPP's <code>htdocs/</code> directory, start Apache from the XAMPP Control Panel, and load <code>http://localhost/php/</code> in your browser. All states will persist locally in <code>database.json</code>.
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Left Side: Sports Matches & Hub (8 columns) -->
            <div class="lg:col-span-7 space-y-6">
                
                <div class="bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-5 space-y-4">
                    <div class="flex justify-between items-center border-b border-gray-150 dark:border-zinc-800 pb-3">
                        <div>
                            <h2 class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                                ⚽ Sports Hub Live Center
                            </h2>
                            <p class="text-[10px] text-gray-400">Select any match odd to calculate and propose collaborative escrow stakes.</p>
                        </div>
                        <span class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold animate-pulse">
                            ● LIVE STREAMING
                        </span>
                    </div>

                    <!-- Sports List -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <?php foreach ($matches as $match): ?>
                        <div class="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1d] hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all text-left space-y-2 relative shadow-xs">
                            <div class="flex justify-between items-center">
                                <span class="text-[8.5px] uppercase font-mono font-bold tracking-wider text-gray-400">
                                    <?php echo htmlspecialchars($match['league']); ?>
                                </span>
                                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                                    <?php echo htmlspecialchars($match['time']); ?>
                                </span>
                            </div>

                            <div class="space-y-1">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                                        <?php echo htmlspecialchars($match['homeTeam']); ?>
                                    </span>
                                    <span class="text-xs font-black font-mono text-gray-500">
                                        <?php echo explode('-', $match['score'])[0] ?? '0'; ?>
                                    </span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                                        <?php echo htmlspecialchars($match['awayTeam']); ?>
                                    </span>
                                    <span class="text-xs font-black font-mono text-gray-500">
                                        <?php echo explode('-', $match['score'])[1] ?? '0'; ?>
                                    </span>
                                </div>
                            </div>

                            <!-- Odd select options -->
                            <div class="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-dashed border-gray-200 dark:border-zinc-800">
                                <button onclick="selectMatchOdds('<?php echo $match['id']; ?>', '<?php echo addslashes($match['homeTeam']); ?>', '<?php echo addslashes($match['awayTeam']); ?>', '1', <?php echo $match['odds']['1']; ?>)" class="p-1.5 bg-gray-50 hover:bg-blue-100 dark:bg-zinc-900/50 dark:hover:bg-blue-950/40 border border-gray-200 dark:border-zinc-800 hover:border-blue-500/50 rounded-lg text-center cursor-pointer transition-colors">
                                    <span class="block text-[7.5px] text-gray-400 font-bold">Home</span>
                                    <span class="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 font-mono">@<?php echo number_format($match['odds']['1'], 2); ?></span>
                                </button>
                                <button onclick="selectMatchOdds('<?php echo $match['id']; ?>', '<?php echo addslashes($match['homeTeam']); ?>', '<?php echo addslashes($match['awayTeam']); ?>', 'X', <?php echo $match['odds']['X']; ?>)" class="p-1.5 bg-gray-50 hover:bg-blue-100 dark:bg-zinc-900/50 dark:hover:bg-blue-950/40 border border-gray-200 dark:border-zinc-800 hover:border-blue-500/50 rounded-lg text-center cursor-pointer transition-colors">
                                    <span class="block text-[7.5px] text-gray-400 font-bold">Draw</span>
                                    <span class="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 font-mono">@<?php echo number_format($match['odds']['X'], 2); ?></span>
                                </button>
                                <button onclick="selectMatchOdds('<?php echo $match['id']; ?>', '<?php echo addslashes($match['homeTeam']); ?>', '<?php echo addslashes($match['awayTeam']); ?>', '2', <?php echo $match['odds']['2']; ?>)" class="p-1.5 bg-gray-50 hover:bg-blue-100 dark:bg-zinc-900/50 dark:hover:bg-blue-950/40 border border-gray-200 dark:border-zinc-800 hover:border-blue-500/50 rounded-lg text-center cursor-pointer transition-colors">
                                    <span class="block text-[7.5px] text-gray-400 font-bold">Away</span>
                                    <span class="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 font-mono">@<?php echo number_format($match['odds']['2'], 2); ?></span>
                                </button>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

            </div>

            <!-- Right Side: Collaborative formulation widget (5 columns) -->
            <div class="lg:col-span-5 space-y-6">
                
                <div class="bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-5 space-y-4">
                    <h3 class="text-sm font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-zinc-800 pb-2.5 flex justify-between items-center">
                        <span>🤝 Escrow Formulator</span>
                        <span id="selected_odd_badge" class="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold">No Match Picked</span>
                    </h3>

                    <form id="collabForm" action="process.php?action=create_collab" method="POST" class="space-y-4">
                        <input type="hidden" id="match_id" name="match_id" value="">
                        <input type="hidden" id="selected_outcome" name="selected_outcome" value="1">
                        
                        <div class="space-y-1 text-left">
                            <label class="block text-[9.5px] font-black uppercase text-gray-400 tracking-wider font-mono">Picked Match</label>
                            <div id="picked_match_name" class="p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300">
                                Click on any match odds from the live center to initialize calculations
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-left">
                            <div class="space-y-1">
                                <label class="block text-[9.5px] font-black uppercase text-gray-400 tracking-wider font-mono">Target Formulation Mode</label>
                                <select id="formulation_mode" name="formulation_mode" onchange="calculateTargets()" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold outline-none text-gray-900 dark:text-white">
                                    <option value="total_pool">Total Pool Target</option>
                                    <option value="single_side">Group Target Only</option>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="block text-[9.5px] font-black uppercase text-gray-400 tracking-wider font-mono">Challenge Mode</label>
                                <select id="target_mode" name="target_mode" onchange="calculateTargets()" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold outline-none text-gray-900 dark:text-white">
                                    <option value="proposed">Proposed (Standard)</option>
                                    <option value="op">Optionalized Odd (OP Mode)</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-left">
                            <div class="space-y-1">
                                <label class="block text-[9.5px] font-black uppercase text-gray-400 tracking-wider font-mono">Target Input amount ($)</label>
                                <input type="number" id="target_total_stake" name="target_total_stake" value="100" min="5" oninput="calculateTargets()" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold font-mono outline-none text-gray-900 dark:text-white">
                            </div>
                            <div class="space-y-1">
                                <label class="block text-[9.5px] font-black uppercase text-gray-400 tracking-wider font-mono">Your Initial Contribution ($)</label>
                                <input type="number" id="creator_stake" name="creator_stake" value="20" min="1" oninput="calculateTargets()" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold font-mono outline-none text-gray-900 dark:text-white">
                            </div>
                        </div>

                        <!-- Ready to Merge Toggle -->
                        <div class="pt-1">
                            <label class="flex items-center gap-2.5 p-2.5 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 cursor-pointer group hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
                                <input type="checkbox" id="ready_to_merge" name="ready_to_merge" onchange="toggleReadyToMerge(this)" class="w-4.5 h-4.5 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500">
                                <div class="flex flex-col text-left">
                                    <span class="text-[10px] font-black text-emerald-700 dark:text-emerald-400 font-sans leading-none">Ready to Merge Teams</span>
                                    <span class="text-[8px] text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">Enable auto-merging with similar pools</span>
                                </div>
                            </label>
                        </div>

                        <!-- Estimator Dashboard -->
                        <div id="estimator_box" class="p-3 bg-gray-50 dark:bg-[#1a1b1d] rounded-xl border border-gray-200 dark:border-zinc-800 text-left space-y-1.5 hidden">
                            <span class="block text-[8px] uppercase font-mono tracking-wider font-extrabold text-blue-600 dark:text-blue-400">
                                📊 Real-Time Escrow Pool Estimator
                            </span>
                            <div class="grid grid-cols-2 gap-y-1 text-[9.5px] leading-tight font-sans">
                                <div class="text-gray-500 font-medium">Total Overall Stake:</div>
                                <div id="est_overall_stake" class="text-right font-bold text-gray-800 dark:text-white font-mono">$0.00</div>
                                
                                <div class="text-gray-500 font-medium">Total Group Target Stake:</div>
                                <div id="est_group_target" class="text-right font-bold text-gray-800 dark:text-white font-mono">$0.00</div>

                                <div class="text-gray-500 font-medium">Your Contribution:</div>
                                <div id="est_your_contribution" class="text-right font-bold text-gray-800 dark:text-white font-mono">$0.00</div>

                                <div class="text-gray-500 font-medium">Selected Odd Decimal:</div>
                                <div id="est_odd_value" class="text-right font-bold text-emerald-600 font-mono">@0.00</div>
                                
                                <div class="col-span-2 border-t border-dashed border-gray-200 dark:border-zinc-800 my-1"></div>
                                
                                <div class="text-gray-900 dark:text-gray-200 font-black">Calculated Return if Won:</div>
                                <div id="est_payout" class="text-right font-extrabold text-emerald-500 font-mono text-xs">$0.00</div>
                            </div>
                        </div>

                        <!-- Optionalized Mode dual split -->
                        <div id="op_estimator_box" class="space-y-2 hidden">
                            <div class="flex gap-2">
                                <div class="flex-1 p-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-left font-sans">
                                    <span id="op_label_1" class="block text-[8px] uppercase font-mono tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">If Opponent: Draw</span>
                                    <div class="grid grid-cols-2 gap-y-0.5 text-[8.5px] leading-tight font-sans mt-1">
                                        <div class="text-gray-500">Overall:</div>
                                        <div id="op_overall_1" class="text-right font-bold font-mono">$0.00</div>
                                        <div class="text-gray-500">Group Target:</div>
                                        <div id="op_group_1" class="text-right font-bold font-mono">$0.00</div>
                                    </div>
                                </div>
                                <div class="flex-1 p-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-left font-sans">
                                    <span id="op_label_2" class="block text-[8px] uppercase font-mono tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">If Opponent: Away</span>
                                    <div class="grid grid-cols-2 gap-y-0.5 text-[8.5px] leading-tight font-sans mt-1">
                                        <div class="text-gray-500">Overall:</div>
                                        <div id="op_overall_2" class="text-right font-bold font-mono">$0.00</div>
                                        <div class="text-gray-500">Group Target:</div>
                                        <div id="op_group_2" class="text-right font-bold font-mono">$0.00</div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-[8px] text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50 dark:border-amber-900/30 text-left font-medium">
                                💡 Optionalized mode holds the highest group target amount pending the opponent's choice. If the opponent chooses the option requiring a lower group stake, the extra funds will be automatically refunded to all contributors proportionately.
                            </div>
                        </div>

                        <!-- Tolerance Merge Filter Interface (Only shows when Ready to Merge is checked!) -->
                        <div id="tolerance_merge_box" class="space-y-2.5 p-3.5 bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-900/30 rounded-xl font-sans hidden">
                            <div class="flex justify-between items-center">
                                <label class="block text-[9px] uppercase font-mono tracking-wider font-extrabold text-gray-500 dark:text-gray-400">
                                    +/- Merge Tolerance ($)
                                </label>
                                <span class="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[8px] font-mono px-2 py-0.5 rounded-full font-bold">Automatic scan</span>
                            </div>
                            <input type="number" id="merge_tolerance" name="merge_tolerance" value="7" oninput="scanMatchingPools()" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-mono outline-none text-gray-900 dark:text-white" placeholder="e.g. 7">
                            
                            <div id="scanned_results_info" class="text-[8.5px] text-emerald-700 dark:text-emerald-500 font-medium leading-tight text-left">
                                Scanning for active pools on selected match...
                            </div>

                            <div id="matching_pools_list" class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                <!-- Loaded dynamically via scanMatchingPools JS -->
                                <div class="text-[9.5px] text-gray-400 text-center py-2 italic">Select a match first to search compatible groups.</div>
                            </div>
                        </div>

                        <button type="submit" id="submit_collab_btn" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all text-center cursor-pointer shadow-sm">
                            🤝 Initialize Collaborators Escrow
                        </button>
                    </form>
                </div>

            </div>

        </div>

        <!-- 2. My Pending Collaboration Pools -->
        <div class="bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
            <h3 class="text-sm font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-zinc-800 pb-3 flex justify-between items-center">
                <span>🤝 Pending Collaboration Pools</span>
                <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-[9px] font-black">
                    <?php echo count($collabChallenges); ?> active
                </span>
            </h3>

            <?php if (empty($collabChallenges)): ?>
                <p class="text-xs text-gray-400 italic py-4 text-center">No active collaborative pools available.</p>
            <?php else: ?>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <?php foreach ($collabChallenges as $collab): ?>
                    <div class="p-4 bg-gray-50 dark:bg-[#1a1b1d] border border-gray-200 dark:border-zinc-800 rounded-2xl text-left space-y-3 relative shadow-xs">
                        
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-[8.5px] font-mono font-bold block w-fit mb-1">
                                    <?php echo htmlspecialchars($collab['prediction']); ?>
                                </span>
                                <h4 class="text-xs font-bold text-gray-900 dark:text-white"><?php echo htmlspecialchars($collab['matchName']); ?></h4>
                            </div>
                            <span class="text-[9.5px] font-mono font-black text-emerald-600">@<?php echo number_format($collab['odds'], 2); ?></span>
                        </div>

                        <!-- Progress Bar -->
                        <?php 
                        $targetCreator = $collab['targetStakeCreator'] ?? $collab['targetTotalStake'];
                        $currentCreator = $collab['currentStakeCreator'] ?? $collab['currentTotalStake'];
                        $pct = ($targetCreator > 0) ? ($currentCreator / $targetCreator) * 100 : 0;
                        if ($pct > 100) $pct = 100;
                        ?>
                        <div class="space-y-1.5 font-sans">
                            <div class="flex justify-between text-[9px] font-extrabold text-gray-400 font-mono">
                                <span>Group Progress</span>
                                <span>$<?php echo number_format($currentCreator, 2); ?> / $<?php echo number_format($targetCreator, 2); ?></span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div class="bg-indigo-500 h-full rounded-full transition-all duration-300" style="width: <?php echo $pct; ?>%"></div>
                            </div>
                        </div>

                        <!-- Contributors List -->
                        <div class="bg-white dark:bg-zinc-900/50 p-2.5 rounded-xl border border-gray-150 dark:border-zinc-800/80 space-y-1.5 text-[9.5px]">
                            <span class="block text-[8px] uppercase tracking-wider text-gray-400 font-mono font-bold">Group Contributors:</span>
                            <div class="space-y-1">
                                <?php foreach ($collab['contributors'] as $contrib): ?>
                                <div class="flex justify-between items-center text-gray-600 dark:text-gray-350">
                                    <span class="font-bold truncate max-w-[120px]"><?php echo htmlspecialchars($contrib['name']); ?></span>
                                    <span class="font-mono">$<?php echo number_format($contrib['stake'], 2); ?></span>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <div class="flex items-center justify-between text-[8px] uppercase font-mono text-gray-400 pt-1">
                            <span>Status: <strong class="text-indigo-600 dark:text-indigo-400"><?php echo htmlspecialchars($collab['status']); ?></strong></span>
                            <?php if (!empty($collab['readyToMerge'])): ?>
                            <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-black">🤝 Mergeable</span>
                            <?php endif; ?>
                        </div>

                        <!-- Action Buttons -->
                        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-gray-200 dark:border-zinc-800/80">
                            <!-- Support +$20 -->
                            <form action="process.php?action=support_collab" method="POST">
                                <input type="hidden" name="collab_id" value="<?php echo $collab['id']; ?>">
                                <input type="hidden" name="amount" value="20">
                                <button type="submit" class="w-full py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 border border-blue-200/40 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg transition-all cursor-pointer">
                                    ➕ Support +$20
                                </button>
                            </form>

                            <!-- Merge Teams Portal Trigger -->
                            <button onclick="openMergePortal('<?php echo $collab['id']; ?>', '<?php echo addslashes($collab['matchName']); ?>', '<?php echo addslashes($collab['prediction']); ?>', <?php echo $currentCreator; ?>, <?php echo $targetCreator; ?>)" class="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 border border-emerald-200/40 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg transition-all cursor-pointer">
                                🤝 Merge Team
                            </button>
                        </div>

                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- 3. Social Feed & Banter Hub -->
        <div id="banter" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Feed area (7 columns) -->
            <div class="lg:col-span-8 bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-5 space-y-4">
                <h3 class="text-sm font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-zinc-800 pb-3">
                    💬 FaceLook Banter Feed
                </h3>

                <!-- Compose Post -->
                <form action="process.php?action=add_post" method="POST" enctype="multipart/form-data" class="space-y-3 text-left">
                    <textarea name="content" placeholder="Share your slips, banter with opponents, or propose custom challenge ratios..." rows="2" class="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 text-gray-900 dark:text-white" required></textarea>
                    
                    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-gray-150 dark:border-zinc-800 pt-2">
                        <div class="flex gap-2">
                            <label class="cursor-pointer text-[10.5px] font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                                <span>📷 Photo/Video</span>
                                <input type="file" name="media" accept="image/*,video/*" class="hidden">
                            </label>
                            
                            <button type="button" class="cursor-pointer text-[10.5px] font-bold text-red-600 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                                <span class="animate-pulse">🔴</span> Go Live
                            </button>
                        </div>

                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-black px-4 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer">
                            Post Banter
                        </button>
                    </div>
                </form>

                <!-- Post listings -->
                <div class="space-y-4 pt-2">
                    <?php foreach ($posts as $post): ?>
                    <div class="p-4 bg-gray-50 dark:bg-[#1a1b1d] rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 text-left space-y-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-black text-xs font-mono">
                                <?php echo htmlspecialchars($post['avatar']); ?>
                            </div>
                            <div>
                                <h4 class="text-xs font-extrabold text-gray-800 dark:text-white leading-tight"><?php echo htmlspecialchars($post['author']); ?></h4>
                                <span class="text-[9px] text-gray-400"><?php echo htmlspecialchars($post['time']); ?></span>
                            </div>
                        </div>

                        <p class="text-xs text-gray-700 dark:text-gray-300 leading-normal font-sans">
                            <?php echo htmlspecialchars($post['content']); ?>
                        </p>

                        <?php if (!empty($post['media'])): ?>
                        <div class="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                            <?php if (preg_match('/\.(mp4|webm|ogg)$/i', $post['media'])): ?>
                                <video controls class="w-full h-auto max-h-[300px] object-cover">
                                    <source src="<?php echo htmlspecialchars($post['media']); ?>" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            <?php else: ?>
                                <img src="<?php echo htmlspecialchars($post['media']); ?>" alt="Post attachment" class="w-full h-auto max-h-[300px] object-cover">
                            <?php endif; ?>
                        </div>
                        <?php endif; ?>

                        <!-- Likes / Actions -->
                        <div class="flex items-center gap-4 text-[10px] text-gray-400 border-t border-b border-gray-150 dark:border-zinc-800/80 py-2">
                            <form action="process.php?action=like_post" method="POST" class="inline">
                                <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                                <button type="submit" class="hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1 font-bold">
                                    ❤️ Like (<?php echo $post['likes']; ?>)
                                </button>
                            </form>
                            <span class="font-bold flex items-center gap-1">💬 Comments (<?php echo count($post['comments']); ?>)</span>
                        </div>

                        <!-- Comments section -->
                        <?php if (!empty($post['comments'])): ?>
                        <div class="space-y-2 bg-white dark:bg-zinc-900/30 p-2.5 rounded-xl border border-gray-150 dark:border-zinc-800/60">
                            <?php foreach ($post['comments'] as $comm): ?>
                            <div class="text-[10px] leading-relaxed">
                                <strong class="text-gray-800 dark:text-white font-extrabold mr-1"><?php echo htmlspecialchars($comm['author']); ?>:</strong>
                                <span class="text-gray-600 dark:text-gray-300"><?php echo htmlspecialchars($comm['content']); ?></span>
                                <span class="block text-[8px] text-gray-400 font-mono mt-0.5"><?php echo htmlspecialchars($comm['time']); ?></span>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        <?php endif; ?>

                        <!-- Add Comment -->
                        <form action="process.php?action=add_comment" method="POST" class="flex gap-2">
                            <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                            <input type="text" name="comment" placeholder="Write a supportive or challenging reply..." class="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-1.5 px-3 text-[10.5px] outline-none focus:border-blue-500 text-gray-900 dark:text-white">
                            <button type="submit" class="bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-[9.5px] font-bold px-3 py-1 rounded-lg cursor-pointer">
                                Reply
                            </button>
                        </form>
                    </div>
                    <?php endforeach; ?>
                </div>

            </div>

            <!-- Star AI expert chat (4 columns) -->
            <div class="lg:col-span-4 bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                <div>
                    <h3 class="text-sm font-black text-gray-900 dark:text-white border-b border-gray-150 dark:border-zinc-800 pb-2.5 flex justify-between items-center">
                        <span>⭐ Star AI Sportswriter</span>
                        <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase font-mono">Chat Bot</span>
                    </h3>

                    <!-- Message History -->
                    <div id="chat_history" class="space-y-2 h-64 overflow-y-auto p-2 border border-gray-150 dark:border-zinc-800/80 rounded-xl bg-gray-50/50 dark:bg-zinc-900/30 text-left mt-3">
                        <div class="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-950/20 text-[10.5px] leading-relaxed">
                            <strong class="text-blue-700 dark:text-blue-400">Star AI Expert:</strong> Hello Collins! I am your AI sports analytics partner. Ask me about escrow multipliers, team odds, the OP mode refunds, or how to merge groups!
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 mt-4">
                    <input type="text" id="chat_input" placeholder="Type a message..." class="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-2 text-xs outline-none text-gray-900 dark:text-white">
                    <button onclick="sendChatMessage()" class="bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-black px-3 py-1.5 rounded-lg cursor-pointer shadow-xs">
                        Send
                    </button>
                </div>
            </div>

        </div>

        <!-- 4. My Wallet Ledger and Banking -->
        <div id="wallet" class="bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
            <div class="border-b border-gray-150 dark:border-zinc-800 pb-4">
                <h3 class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                    💳 Escrow Banking Wallet & Transactions
                </h3>
                <p class="text-[10px] text-gray-400">Easily simulate fund deposits or withdrawals. Transactions are automatically logged.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Action Center -->
                <div class="space-y-4">
                    <h4 class="text-xs font-extrabold uppercase font-mono text-gray-400">Transaction Simulator</h4>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <form action="process.php?action=deposit" method="POST" class="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 text-left space-y-2">
                            <span class="block text-[9px] uppercase tracking-wider font-extrabold text-emerald-600 font-mono">Deposit Funds</span>
                            <input type="number" name="amount" value="100" min="5" class="w-full bg-white dark:bg-[#151618] border border-gray-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-mono font-bold outline-none text-gray-900 dark:text-white">
                            <button type="submit" class="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition-all shadow-sm">
                                Confirm Deposit
                            </button>
                        </form>

                        <form action="process.php?action=withdraw" method="POST" class="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 text-left space-y-2">
                            <span class="block text-[9px] uppercase tracking-wider font-extrabold text-rose-600 font-mono">Withdraw Funds</span>
                            <input type="number" name="amount" value="50" min="5" class="w-full bg-white dark:bg-[#151618] border border-gray-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-mono font-bold outline-none text-gray-900 dark:text-white">
                            <button type="submit" class="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition-all shadow-sm">
                                Confirm Withdraw
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Transaction Ledger List -->
                <div class="space-y-4 text-left">
                    <h4 class="text-xs font-extrabold uppercase font-mono text-gray-400">Live Transaction History</h4>
                    <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                        <?php if (empty($wallet['transactions'])): ?>
                            <p class="text-[10px] text-gray-400 italic">No logged transactions.</p>
                        <?php else: ?>
                            <?php foreach (array_reverse($wallet['transactions']) as $tx): ?>
                            <div class="p-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl flex justify-between items-center text-[10.5px]">
                                <div>
                                    <span class="font-extrabold text-gray-800 dark:text-white block"><?php echo htmlspecialchars($tx['target']); ?></span>
                                    <span class="text-[8.5px] text-gray-400 font-mono"><?php echo htmlspecialchars($tx['time']); ?></span>
                                </div>
                                <span class="font-bold font-mono <?php echo $tx['type'] === 'deposit' ? 'text-emerald-500' : 'text-rose-500'; ?>">
                                    <?php echo $tx['type'] === 'deposit' ? '+' : '-'; ?>$<?php echo number_format($tx['amount'], 2); ?>
                                </span>
                            </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <!-- Interactive Merge Modal Dialogue -->
    <div id="merge_modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center hidden p-4">
        <div class="bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-md p-6 space-y-4 relative shadow-2xl">
            <button onclick="closeMergeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
            
            <div class="border-b border-gray-150 dark:border-zinc-800 pb-3">
                <h3 class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                    🤝 Manual Merge Team Collaborations
                </h3>
                <p class="text-[10px] text-gray-400">Combine forces with another active pool betting on the same match and prediction.</p>
            </div>

            <div class="space-y-2 text-left bg-gray-50 dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div class="text-[9.5px] font-bold text-gray-400 uppercase font-mono">Your Selected Pool Details</div>
                <h4 id="merge_src_match" class="text-xs font-extrabold text-gray-900 dark:text-white">Manchester United vs Chelsea</h4>
                <div class="flex justify-between items-center text-[10.5px] mt-1 text-gray-600 dark:text-gray-350 font-sans">
                    <span>Prediction: <strong id="merge_src_pred" class="text-indigo-600">Draw (X)</strong></span>
                    <span>Funded: <strong id="merge_src_amount" class="font-mono">$50.00</strong></span>
                </div>
            </div>

            <!-- List of compatible pools -->
            <div class="space-y-2 text-left">
                <label class="block text-[9px] font-black uppercase text-gray-400 tracking-wider font-mono">Compatible Pools Seeking Merge</label>
                <div id="modal_compatible_list" class="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <!-- Loaded dynamically in JS -->
                </div>
            </div>
        </div>
    </div>

    <!-- Client-side calculation script -->
    <script>
        // Global variables populated from PHP state
        const collabChallenges = <?php echo json_encode($collabChallenges); ?>;
        const liveMatches = <?php echo json_encode($matches); ?>;
        
        // Active selection state
        let currentMatchId = "";
        let currentHome = "";
        let currentAway = "";
        let currentOutcome = "1";
        let currentOdds = 1.0;

        function selectMatchOdds(id, home, away, outcome, odd) {
            currentMatchId = id;
            currentHome = home;
            currentAway = away;
            currentOutcome = outcome;
            currentOdds = parseFloat(odd);

            // Set inputs
            document.getElementById('match_id').value = id;
            document.getElementById('selected_outcome').value = outcome;
            document.getElementById('picked_match_name').innerHTML = `⚽ <strong>${home} vs ${away}</strong> <span class="text-blue-500 font-mono ml-2">(${outcome === 'X' ? 'Draw' : outcome === '1' ? 'Home' : 'Away'} @${odd.toFixed(2)})</span>`;
            document.getElementById('selected_odd_badge').innerHTML = `@${odd.toFixed(2)}`;

            // Activate and update estimators
            document.getElementById('estimator_box').classList.remove('hidden');
            
            // Recalculate targets
            calculateTargets();
            scanMatchingPools();
        }

        function toggleReadyToMerge(el) {
            const isChecked = el.checked;
            const toleranceBox = document.getElementById('tolerance_merge_box');
            const submitBtn = document.getElementById('submit_collab_btn');

            if (isChecked) {
                toleranceBox.classList.remove('hidden');
                submitBtn.disabled = true;
                submitBtn.className = "w-full py-2.5 bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 text-xs font-black rounded-xl transition-all text-center cursor-not-allowed shadow-xs";
                scanMatchingPools();
            } else {
                toleranceBox.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.className = "w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all text-center cursor-pointer shadow-sm";
            }
        }

        function calculateTargets() {
            if (!currentMatchId) return;

            const formulationMode = document.getElementById('formulation_mode').value;
            const targetMode = document.getElementById('target_mode').value;
            const targetInput = parseFloat(document.getElementById('target_total_stake').value) || 0;
            const creatorStake = parseFloat(document.getElementById('creator_stake').value) || 0;

            const currentMatch = liveMatches.find(m => m.id === currentMatchId);
            if (!currentMatch) return;

            // Odds mapping
            const odds1 = currentMatch.odds['1'] || 2.0;
            const oddsX = currentMatch.odds['X'] || 3.0;
            const odds2 = currentMatch.odds['2'] || 4.0;

            const remainingSymbols = ["1", "X", "2"].filter(sym => sym !== currentOutcome);

            // Base targets on first opponent option
            const targets = getCollabTargetFormula(formulationMode, odds1, oddsX, odds2, currentOutcome, remainingSymbols[0], targetInput);

            // Handle dual option splitting for OP (Optionalized Odd) Mode
            const opBox = document.getElementById('op_estimator_box');
            if (targetMode === 'op') {
                opBox.classList.remove('hidden');
                
                const targetsOpt1 = getCollabTargetFormula(formulationMode, odds1, oddsX, odds2, currentOutcome, remainingSymbols[0], targetInput);
                const targetsOpt2 = getCollabTargetFormula(formulationMode, odds1, oddsX, odds2, currentOutcome, remainingSymbols[1], targetInput);

                // Set labels and values
                document.getElementById('op_label_1').innerHTML = `📊 If Opponent: ${remainingSymbols[0] === 'X' ? 'Draw (X)' : remainingSymbols[0] === '1' ? 'Home' : 'Away'}`;
                document.getElementById('op_overall_1').innerHTML = `$${targetsOpt1.targetTotalStake.toFixed(2)}`;
                document.getElementById('op_group_1').innerHTML = `$${targetsOpt1.targetStakeCreator.toFixed(2)}`;

                document.getElementById('op_label_2').innerHTML = `📊 If Opponent: ${remainingSymbols[1] === 'X' ? 'Draw (X)' : remainingSymbols[1] === '1' ? 'Home' : 'Away'}`;
                document.getElementById('op_overall_2').innerHTML = `$${targetsOpt2.targetTotalStake.toFixed(2)}`;
                document.getElementById('op_group_2').innerHTML = `$${targetsOpt2.targetStakeCreator.toFixed(2)}`;

                // Hold highest group stake in primary targets
                const finalGroupStake = Math.max(targetsOpt1.targetStakeCreator, targetsOpt2.targetStakeCreator);
                const finalTotalStake = targetsOpt1.targetStakeCreator > targetsOpt2.targetStakeCreator ? targetsOpt1.targetTotalStake : targetsOpt2.targetTotalStake;

                document.getElementById('est_overall_stake').innerHTML = `$${finalTotalStake.toFixed(2)}`;
                document.getElementById('est_group_target').innerHTML = `$${finalGroupStake.toFixed(2)}`;
                document.getElementById('est_your_contribution').innerHTML = `$${creatorStake.toFixed(2)}`;
                document.getElementById('est_odd_value').innerHTML = `@${currentOdds.toFixed(2)}`;

                const returnVal = finalGroupStake > 0 ? (creatorStake / finalGroupStake) * finalTotalStake : 0;
                document.getElementById('est_payout').innerHTML = `$${returnVal.toFixed(2)}`;
            } else {
                opBox.classList.add('hidden');
                
                document.getElementById('est_overall_stake').innerHTML = `$${targets.targetTotalStake.toFixed(2)}`;
                document.getElementById('est_group_target').innerHTML = `$${targets.targetStakeCreator.toFixed(2)}`;
                document.getElementById('est_your_contribution').innerHTML = `$${creatorStake.toFixed(2)}`;
                document.getElementById('est_odd_value').innerHTML = `@${currentOdds.toFixed(2)}`;

                const returnVal = targets.targetStakeCreator > 0 ? (creatorStake / targets.targetStakeCreator) * targets.targetTotalStake : 0;
                document.getElementById('est_payout').innerHTML = `$${returnVal.toFixed(2)}`;
            }
        }

        function getCollabTargetFormula(mode, odds1, oddsX, odds2, creatorSel, oppSelection, targetInput) {
            const allOutcomes = [
                { symbol: "1", odd: odds1 },
                { symbol: "X", odd: oddsX },
                { symbol: "2", odd: odds2 }
            ];

            const creatorOutcome = allOutcomes.find(o => o.symbol === creatorSel) || allOutcomes[0];
            const creatorOdds = creatorOutcome.odd;

            // Opponent calculation
            let oppSymbol = "2";
            if (creatorSel === "1") {
                oppSymbol = oppSelection === "X" ? "X" : "2";
            } else if (creatorSel === "X") {
                oppSymbol = oppSelection === "1" ? "1" : "2";
            } else {
                oppSymbol = oppSelection === "1" ? "1" : "X";
            }

            const oppOutcome = allOutcomes.find(o => o.symbol === oppSymbol) || allOutcomes[2];
            const oppOdds = oppOutcome.odd;

            if (mode === "single_side") {
                const targetStakeCreator = targetInput;
                const payout = targetStakeCreator * creatorOdds;
                const targetStakeOpp = payout / oppOdds;
                const targetTotalStake = targetStakeCreator + targetStakeOpp;
                return {
                    targetStakeCreator,
                    targetTotalStake,
                    oppOdds
                };
            } else {
                const targetTotalStake = targetInput;
                const ipCreator = 1 / creatorOdds;
                const ipOpp = 1 / oppOdds;
                const totalIp = ipCreator + ipOpp;

                const creatorPct = ipCreator / totalIp;
                const oppPct = ipOpp / totalIp;

                const targetStakeCreator = creatorPct * targetTotalStake;
                const targetStakeOpp = oppPct * targetTotalStake;

                return {
                    targetStakeCreator,
                    targetTotalStake,
                    oppOdds
                };
            }
        }

        // +/- Merge Tolerance Algorithm
        function scanMatchingPools() {
            const isChecked = document.getElementById('ready_to_merge').checked;
            if (!isChecked || !currentMatchId) return;

            const creatorStake = parseFloat(document.getElementById('creator_stake').value) || 0;
            const tolerance = parseFloat(document.getElementById('merge_tolerance').value) || 0;

            const minAmount = Math.max(0, creatorStake - tolerance);
            const maxAmount = creatorStake + tolerance;

            const currentMatchName = `${currentHome} vs ${currentAway}`;
            
            // Filter candidates
            const candidates = collabChallenges.filter(c => {
                if (c.status !== "collecting") return false;
                if (c.matchName !== currentMatchName) return false;
                
                const normalizedPredictionSymbol = currentOutcome === 'X' ? 'Draw (X)' : currentOutcome === '1' ? `Home (1)` : `Away (2)`;
                if (!c.prediction.includes(currentOutcome)) return false;

                const tTarget = c.targetStakeCreator || c.targetTotalStake;
                const cTarget = c.currentStakeCreator || c.currentTotalStake;
                const lack = tTarget - cTarget;

                return lack > 0 && lack >= minAmount && lack <= maxAmount;
            });

            // Update UI elements
            document.getElementById('scanned_results_info').innerHTML = `Scanning for active pools on <strong class="font-bold text-gray-900 dark:text-white">${currentMatchName}</strong> matching <strong class="font-bold text-gray-900 dark:text-white">${currentOutcome}</strong> that lack between <strong class="font-mono text-emerald-600">$${minAmount.toFixed(2)}</strong> and <strong class="font-mono text-emerald-600">$${maxAmount.toFixed(2)}</strong>:`;

            const listContainer = document.getElementById('matching_pools_list');
            listContainer.innerHTML = "";

            if (candidates.length === 0) {
                listContainer.innerHTML = `<div class="text-[9.5px] text-gray-400 text-center py-3 bg-white/50 dark:bg-zinc-900/30 rounded-lg border border-dashed border-gray-200 dark:border-zinc-800">No matching pools lacking this specific amount. Adjust tolerance.</div>`;
                return;
            }

            candidates.forEach(pool => {
                const tTarget = pool.targetStakeCreator || pool.targetTotalStake;
                const cTarget = pool.currentStakeCreator || pool.currentTotalStake;
                const lack = tTarget - cTarget;

                const div = document.createElement('div');
                div.className = "p-2.5 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl flex justify-between items-center bg-white dark:bg-[#1a1b1c] shadow-xs text-xs";
                div.innerHTML = `
                    <div>
                        <span class="block text-[10px] font-black text-gray-800 dark:text-white truncate max-w-[150px]">${pool.creator}</span>
                        <span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold block mt-0.5">Lacking: $${lack.toFixed(2)}</span>
                    </div>
                    <form action="process.php?action=support_collab" method="POST">
                        <input type="hidden" name="collab_id" value="${pool.id}">
                        <input type="hidden" name="amount" value="${lack}">
                        <button type="submit" class="bg-emerald-600 text-white text-[9.5px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-500 shadow-sm transition-all">
                            Merge & Join
                        </button>
                    </form>
                `;
                listContainer.appendChild(div);
            });
        }

        // Merge Modal Dialogue handling
        function openMergePortal(id, matchName, prediction, currentAmt, targetAmt) {
            document.getElementById('merge_modal').classList.remove('hidden');
            document.getElementById('merge_src_match').innerHTML = matchName;
            document.getElementById('merge_src_pred').innerHTML = prediction;
            document.getElementById('merge_src_amount').innerHTML = `$${currentAmt.toFixed(2)} / $${targetAmt.toFixed(2)}`;

            // Search compatible pools to merge with
            const compatible = collabChallenges.filter(c => {
                return c.id !== id && c.matchName === matchName && c.prediction === prediction && c.readyToMerge && c.status === 'collecting';
            });

            const container = document.getElementById('modal_compatible_list');
            container.innerHTML = "";

            if (compatible.length === 0) {
                container.innerHTML = `<div class="text-xs text-center text-gray-400 py-6 italic">No compatible mergeable pools are currently active. Click "Ready to Merge Teams" when initializing to enable!</div>`;
                return;
            }

            compatible.forEach(opp => {
                const div = document.createElement('div');
                div.className = "p-3 bg-white dark:bg-[#1a1b1d] border border-gray-200 dark:border-zinc-800 rounded-xl flex justify-between items-center text-xs";
                div.innerHTML = `
                    <div>
                        <span class="font-extrabold text-gray-800 dark:text-white block">${opp.creator}</span>
                        <span class="text-[10px] text-indigo-600 font-mono font-bold">Funded: $${opp.currentTotalStake.toFixed(2)} / $${opp.targetTotalStake.toFixed(2)}</span>
                    </div>
                    <form action="process.php?action=merge_collabs" method="POST">
                        <input type="hidden" name="target_id" value="${id}">
                        <input type="hidden" name="source_id" value="${opp.id}">
                        <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                            🤝 Merge forces
                        </button>
                    </form>
                `;
                container.appendChild(div);
            });
        }

        function closeMergeModal() {
            document.getElementById('merge_modal').classList.add('hidden');
        }

        // Simulated AI Chat
        function sendChatMessage() {
            const input = document.getElementById('chat_input');
            const message = input.value.trim();
            if (!message) return;

            // Display user message
            const history = document.getElementById('chat_history');
            const userDiv = document.createElement('div');
            userDiv.className = "p-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 text-[10.5px] leading-relaxed mt-2";
            userDiv.innerHTML = `<strong class="text-gray-800 dark:text-white">You:</strong> ${message}`;
            history.appendChild(userDiv);

            input.value = "";
            history.scrollTop = history.scrollHeight;

            // Generate simulated response based on keywords
            setTimeout(() => {
                let reply = "That's an interesting sports strategy! Let me research the team analytics for you. I recommend trying the 'Optionalized Market Odd' (OP Mode) to safeguard your group escrow pools against varying odd spreads.";
                
                if (message.toLowerCase().includes('merge') || message.toLowerCase().includes('ready')) {
                    reply = "When you tick 'Ready to Merge Teams', the Escrow Formulator unlocks the target matching ledger. You can enter an individual stake amount, specify the '+/- merge tolerance' parameter, and automatically join other active pools lacking exactly that balance!";
                } else if (message.toLowerCase().includes('odd') || message.toLowerCase().includes('decimal') || message.toLowerCase().includes('op')) {
                    reply = "The Optionalized Odd (OP) Mode allows groups to bet together even before an opponent chooses their side. It locks the highest possible group stake target. If the opponent ultimately accepts a lower odd outcome, our process returns the excess stake back to your wallets instantly.";
                }

                const aiDiv = document.createElement('div');
                aiDiv.className = "p-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-950/20 text-[10.5px] leading-relaxed mt-2";
                aiDiv.innerHTML = `<strong class="text-blue-700 dark:text-blue-400">Star AI Expert:</strong> ${reply}`;
                history.appendChild(aiDiv);
                history.scrollTop = history.scrollHeight;
            }, 800);
        }
    </script>
</body>
</html>
