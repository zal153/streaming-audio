<?php
$config = [
    'radio_url' => 'http://cc112sumenep.com:8000/ilm?type=.mp3',
    'page_title' => 'Informasi Layanan Masyarakat',
];

function checkRadioStatus($url)
{
    $headers = @get_headers($url);
    return $headers && strpos($headers[0], '200') !== false;
}

$isRadioOnline = checkRadioStatus($config['radio_url']);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($config['page_title']); ?></title>
    <!-- Meta tag untuk kebijakan autoplay -->
    <meta name="autoplay-policy" content="allowed">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <link rel="stylesheet" href="assets/css/styles.css">

    <style>
        <?php if (!$isRadioOnline): ?>.offline-notice {
            background: rgba(255, 0, 0, 0.1);
            color: #ff4444;
            padding: 10px;
            border-radius: 40px;
            margin-bottom: 20px;
            text-align: center;
        }

        <?php endif; ?>.autoplay-message {
            background: rgba(255, 165, 0, 0.1);
            color: #ff8c00;
            padding: 8px;
            border-radius: 20px;
            margin-bottom: 10px;
            text-align: center;
            font-size: 0.9em;
        }

        #volumeButton {
            margin-left: 10px;
            background: transparent;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <?php if (!$isRadioOnline): ?>
        <div class="offline-notice">
            Radio stream is currently offline. Please try again later.
        </div>
    <?php endif; ?>
    <div class="container">

        <div class="main-content">
            <nav>
                <div class="profile-pic">
                    <img src="assets/images/logo.jpg" alt="Profile Picture" style="width: 50px; height: 50px; border-radius: 50%;">
                </div>
                <div class="nav-links">
                    <?php
                    $navItems = [
                        'Home' => '#'
                    ];

                    foreach ($navItems as $name => $url) {
                        $activeClass = ($name === 'Home') ? 'class="active"' : '';
                        echo "<a href=\"" . htmlspecialchars($url) . "\" $activeClass>" . htmlspecialchars($name) . "</a>";
                    }
                    ?>
                    <span id="currentDateTime" style="color: white; margin-left: auto;"></span>
                </div>
            </nav>

            <h1><?php echo htmlspecialchars($config['page_title']); ?></h1>
            <p class="description">Dengarkan lagu favorit anda bersama kami<br>Streaming musik 24/7</p>

            <div class="player-card">
                <?php if ($isRadioOnline): ?>
                    <img id="songImage" src="https://via.placeholder.com/300" alt="Song Cover">
                    <div class="song-info">
                        <h3 id="songTitle">Loading...</h3>
                        <p id="artistName">Loading...</p>
                    </div>
                    <div class="text-center" id="elapsedTime">00:00</div>
                    <div class="controls">
                        <button id="playButton"><i data-feather="play"></i></button>
                        <!-- <button id="volumeButton"><i data-feather="volume-2"></i></button> -->
                    </div>
                <?php else: ?>
                    <div class="offline-player">
                        <i data-feather="radio-off"></i>
                        <p>Radio stream is currently unavailable</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <div class="sidebar-section">
            <div class="playlist">
                <h2>Now Playing</h2>
                <div id="currentTrack" class="playlist-item">
                    <div class="playlist-cover">
                        <img id="miniImage" src="https://via.placeholder.com/40" alt="Mini Cover">
                    </div>
                    <div class="track-info">
                        <span id="miniTitle">Loading...</span>
                        <span id="miniArtist" class="artist-name">Loading...</span>
                    </div>
                </div>
            </div>

            <div class="schedule">
                <h2>Jadwal Siaran</h2>
                <div class="schedule-item">
                    <div class="schedule-time">00:00 - 00:00</div>
                    <div class="schedule-info">
                        <h3>Program Name</h3>
                        <p>Program Description</p>
                    </div>
                </div>
            </div>
        </div>

        <?php if ($isRadioOnline): ?>
            <audio id="radioPlayer" src="<?php echo htmlspecialchars($config['radio_url']); ?>" preload="auto"></audio>
        <?php endif; ?>
    </div>

    <script>
        window.radioConfig = {
            isOnline: <?php echo json_encode($isRadioOnline); ?>,
            streamUrl: <?php echo json_encode($config['radio_url']); ?>
        };
    </script>
    <script src="assets/js/player.js"></script>
    <script>
        $(document).ready(function() {
            feather.replace();
        });
    </script>
</body>

</html>