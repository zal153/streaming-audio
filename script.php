<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

function get_metadata()
{
    $url = "http://cc112sumenep.com:8000/ilm";
    $command = "ffmpeg -i $url -f ffmetadata - 2>&1";
    $output = shell_exec($command);

    file_put_contents("ffmpeg_debug.log", $output);

    if (!$output) {
        return ["error" => "Gagal membuka stream atau mendapatkan metadata."];
    }

    $artist = "Tidak diketahui";
    $title = "Tidak ada lagu yang sedang diputar";

    if (preg_match("/StreamTitle\s*=\s*(.+)/i", $output, $matches)) {
        $streamTitle = trim($matches[1]);

        // Pisahkan berdasarkan tanda "-" jika ada
        $parts = explode(" - ", $streamTitle, 2);
        if (count($parts) == 2) {
            $artist = trim($parts[0]) ?: "Tidak diketahui";
            $title = trim($parts[1]) ?: "Tidak ada lagu yang sedang diputar";
        } else {
            $title = $streamTitle;
        }
    }

    // Daftar kata kunci genre
    $genres = [
        "jazz" => ["jazz", "smooth jazz", "swing"],
        "dangdut" => ["dangdut", "koplo", "rhoma"],
        "metal" => ["metal", "rock", "heavy"],
        "pop" => ["pop", "love", "ballad"],
        "hiphop" => ["hiphop", "rap", "trap"],
        "electronic" => ["edm", "techno", "house"],
    ];

    $detectedGenre = "default";

    foreach ($genres as $genre => $keywords) {
        foreach ($keywords as $keyword) {
            if (stripos($title, $keyword) !== false || stripos($artist, $keyword) !== false) {
                $detectedGenre = $genre;
                break 2;
            }
        }
    }

    return ["song" => $title, "artist" => $artist, "genre" => $detectedGenre];
}

$data = get_metadata();
echo json_encode($data);
