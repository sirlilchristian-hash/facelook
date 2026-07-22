<?php
// Initialize PHP session
session_start();

// Define data file path
define('DB_FILE', __DIR__ . '/database.json');
define('UPLOAD_DIR', __DIR__ . '/uploads/');

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}

// Default starting database state
function getDefaultData() {
    return [
        'users' => [
            'id-u1' => ['id' => 'id-u1', 'name' => 'Collins Dnego (You)', 'avatar' => 'CD', 'friends' => ['id-u2', 'id-u3']],
            'id-u2' => ['id' => 'id-u2', 'name' => 'David T.', 'avatar' => 'DT', 'friends' => ['id-u1', 'id-u4']],
            'id-u3' => ['id' => 'id-u3', 'name' => 'Emma W.', 'avatar' => 'EW', 'friends' => ['id-u1']],
            'id-u4' => ['id' => 'id-u4', 'name' => 'Sarah L.', 'avatar' => 'SL', 'friends' => ['id-u2']]
        ],
        'wallet' => [
            'balance' => 1500.00,
            'transactions' => [
                ['id' => 'tx-1', 'type' => 'deposit', 'amount' => 1500.00, 'time' => 'Just now', 'target' => 'Initial Balance']
            ]
        ],
        'matches' => [
            [
                'id' => 'm-1',
                'homeTeam' => 'Manchester United',
                'awayTeam' => 'Chelsea',
                'league' => 'English Premier League',
                'status' => 'LIVE',
                'time' => "68'",
                'score' => '2 - 1',
                'odds' => ['1' => 1.75, 'X' => 3.40, '2' => 4.10],
                'trivia' => 'Old Trafford is rocking! Manchester United is struggling to preserve their thin lead against Chelsea\'s second half surge.',
                'sport' => 'Football',
                'flActiveCount' => 1420
            ],
            [
                'id' => 'm-2',
                'homeTeam' => 'Real Madrid',
                'awayTeam' => 'Barcelona',
                'league' => 'Spanish La Liga',
                'status' => 'UPCOMING',
                'time' => 'Today 21:00',
                'score' => '0 - 0',
                'odds' => ['1' => 1.95, 'X' => 3.80, '2' => 3.20],
                'trivia' => 'El Clasico is here! Both Bellingham and Yamal are fit and starting. P2P global challenges are breaking records.',
                'sport' => 'Football',
                'flActiveCount' => 2280
            ],
            [
                'id' => 'm-3',
                'homeTeam' => 'Boston Celtics',
                'awayTeam' => 'Dallas Mavericks',
                'league' => 'NBA Playoffs',
                'status' => 'LIVE',
                'time' => 'Quarter 3',
                'score' => '88 - 82',
                'odds' => ['1' => 1.45, 'X' => 15.00, '2' => 2.85],
                'trivia' => 'Luka Doncic is on fire with 32 points, but Celtics\' perimeter defense is clamping down. Active look-upto handshakes are live.',
                'sport' => 'Basketball',
                'flActiveCount' => 1150
            ],
            [
                'id' => 'm-4',
                'homeTeam' => 'Gor Mahia',
                'awayTeam' => 'AFC Leopards',
                'league' => 'Kenya Premier League',
                'status' => 'LIVE',
                'time' => "82'",
                'score' => '1 - 1',
                'odds' => ['1' => 2.10, 'X' => 2.80, '2' => 3.00],
                'trivia' => 'The famous Mashemeji Derby in Nairobi. Thousands are singing. Live ratio challenges are multiplying.',
                'sport' => 'Football',
                'flActiveCount' => 1670
            ]
        ],
        'collab_challenges' => [
            [
                'id' => 'collab-1',
                'matchName' => 'Manchester United vs Chelsea',
                'prediction' => 'Draw (X)',
                'odds' => 3.40,
                'targetTotalStake' => 150.00,
                'currentTotalStake' => 90.00,
                'creator' => 'Collins Dnego (You)',
                'contributors' => [
                    ['name' => 'Collins Dnego (You)', 'stake' => 50.00],
                    ['name' => 'John Doe', 'stake' => 40.00]
                ],
                'status' => 'collecting',
                'numOpponents' => 1,
                'opponents' => [],
                'targetMode' => 'proposed',
                'selectedOutcome' => 'X',
                'formulationMode' => 'total_pool',
                'targetStakeCreator' => 100.00,
                'currentStakeCreator' => 90.00,
                'readyToMerge' => true
            ],
            [
                'id' => 'collab-2',
                'matchName' => 'Real Madrid vs Barcelona',
                'prediction' => 'Real Madrid (1)',
                'odds' => 1.95,
                'targetTotalStake' => 300.00,
                'currentTotalStake' => 120.00,
                'creator' => 'Sarah L.',
                'contributors' => [
                    ['name' => 'Sarah L.', 'stake' => 120.00]
                ],
                'status' => 'collecting',
                'numOpponents' => 1,
                'opponents' => [],
                'targetMode' => 'proposed',
                'selectedOutcome' => '1',
                'formulationMode' => 'single_side',
                'targetStakeCreator' => 150.00,
                'currentStakeCreator' => 120.00,
                'readyToMerge' => false
            ]
        ],
        'posts' => [
            [
                'id' => 'post-1',
                'author' => 'David T.',
                'avatar' => 'DT',
                'time' => '10 minutes ago',
                'content' => 'Who wants to challenge Chelsea at Old Trafford? I have a ratio-based collaborative pool going on! Let\'s secure some profit.',
                'likes' => 15,
                'comments' => [
                    ['author' => 'Collins Dnego (You)', 'content' => 'I already support your pool for $20!', 'time' => '5 mins ago']
                ]
            ],
            [
                'id' => 'post-2',
                'author' => 'Emma W.',
                'avatar' => 'EW',
                'time' => '1 hour ago',
                'content' => 'The Mashemeji Derby is crazy! Gor Mahia scoring is all we need to print. Let\'s go!',
                'likes' => 8,
                'comments' => []
            ]
        ]
    ];
}

// Read database
function readDatabase() {
    if (!file_exists(DB_FILE)) {
        writeDatabase(getDefaultData());
    }
    $json = file_get_contents(DB_FILE);
    $data = json_decode($json, true);
    if (!$data) {
        $data = getDefaultData();
        writeDatabase($data);
    }
    return $data;
}

// Write database
function writeDatabase($data) {
    file_put_contents(DB_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

// Math Formula helper for Collaborative / Escrow Targets
function getCollabTargets($mode, $match, $creatorSel, $numOpps, $oppSelection, $targetInput) {
    $odds1 = isset($match['odds']['1']) ? $match['odds']['1'] : 2.0;
    $oddsX = isset($match['odds']['X']) ? $match['odds']['X'] : 3.0;
    $odds2 = isset($match['odds']['2']) ? $match['odds']['2'] : 4.0;

    $allOutcomes = [
        ['symbol' => '1', 'odd' => $odds1],
        ['symbol' => 'X', 'odd' => $oddsX],
        ['symbol' => '2', 'odd' => $odds2]
    ];

    $creatorOutcome = null;
    foreach ($allOutcomes as $o) {
        if ($o['symbol'] === $creatorSel) {
            $creatorOutcome = $o;
            break;
        }
    }
    if (!$creatorOutcome) $creatorOutcome = $allOutcomes[0];
    $creatorOdds = $creatorOutcome['odd'];

    // Define opponent outcome
    $oppSymbol = '2';
    if ($creatorSel === '1') {
        $oppSymbol = ($oppSelection === 'X') ? 'X' : '2';
    } else if ($creatorSel === 'X') {
        $oppSymbol = ($oppSelection === '1') ? '1' : '2';
    } else {
        $oppSymbol = ($oppSelection === '1') ? '1' : 'X';
    }

    $oppOutcome = null;
    foreach ($allOutcomes as $o) {
        if ($o['symbol'] === $oppSymbol) {
            $oppOutcome = $o;
            break;
        }
    }
    if (!$oppOutcome) $oppOutcome = $allOutcomes[2];
    $oppOdds = $oppOutcome['odd'];

    if ($mode === 'single_side') {
        $targetStakeCreator = $targetInput;
        $payout = $targetStakeCreator * $creatorOdds;
        $targetStakeOpp = $payout / $oppOdds;
        $targetTotalStake = $targetStakeCreator + $targetStakeOpp;
        return [
            'targetStakeCreator' => $targetStakeCreator,
            'targetTotalStake' => $targetTotalStake,
            'oppOdds' => $oppOdds,
            'oppSymbol' => $oppSymbol
        ];
    } else {
        // total_pool mode
        $targetTotalStake = $targetInput;
        $ipCreator = 1 / $creatorOdds;
        $ipOpp = 1 / $oppOdds;
        $totalIp = $ipCreator + $ipOpp;

        $creatorPct = $ipCreator / $totalIp;
        $oppPct = $ipOpp / $totalIp;

        $targetStakeCreator = $creatorPct * $targetTotalStake;
        $targetStakeOpp = $oppPct * $targetTotalStake;

        return [
            'targetStakeCreator' => $targetStakeCreator,
            'targetTotalStake' => $targetTotalStake,
            'oppOdds' => $oppOdds,
            'oppSymbol' => $oppSymbol
        ];
    }
}
