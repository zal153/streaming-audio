feather.replace();

// Update DateTime
function updateDateTime() {
  document.getElementById("currentDateTime").textContent =
    new Date().toLocaleString("id-ID");
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Elapsed Time Counter
let elapsedTime = 0;
let timer = setInterval(() => {
  elapsedTime++;
  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
  const seconds = String(elapsedTime % 60).padStart(2, "0");
  document.getElementById("elapsedTime").textContent = `${minutes}:${seconds}`;
}, 1000);

window.addEventListener("beforeunload", () => clearInterval(timer));

// jQuery Radio Player
$(document).ready(function () {
  let radioPlayer = document.getElementById("radioPlayer");
  let playButton = $("#playButton");

  // Autoplay handling
  radioPlayer
    .play()
    .then(() => {
      playButton.html('<i data-feather="pause"></i>');
      feather.replace();
    })
    .catch((error) => {
      console.error("Autoplay failed:", error);
      playButton.html('<i data-feather="play"></i>');
      feather.replace();
    });

  function fetchGenreImage(genre) {
    let query = encodeURIComponent(`${genre} music album cover`);
    let apiKey = "YOUR_GOOGLE_API_KEY"; // Ganti dengan API key Anda
    let cseId = "YOUR_CSE_ID"; // Ganti dengan CSE ID Anda
    let searchUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cseId}&searchType=image&key=${apiKey}`;

    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          $("#songImage").attr("src", data.items[0].link);
          $("#miniImage").attr("src", data.items[0].link);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }

  function updateSong() {
    $.getJSON("script.php")
      .done(function (data) {
        if (data.error) {
          $("#songTitle, #miniTitle").text(data.error);
          $("#artistName, #miniArtist").text("");
        } else {
          const songTitle = data.song || "Tidak ada lagu yang sedang diputar";
          const artistName = data.artist || "Tidak diketahui";

          $("#songTitle, #miniTitle").text(songTitle);
          $("#artistName, #miniArtist").text(artistName);

          let genre = data.genre || "default";
          fetchGenreImage(genre);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Error:", textStatus, errorThrown);
        $("#songTitle, #miniTitle").text("Gagal mengambil informasi lagu");
        $("#artistName, #miniArtist").text("");
      });
  }

  updateSong();
  setInterval(updateSong, 5000);

  playButton.click(function () {
    if (radioPlayer.paused) {
      radioPlayer
        .play()
        .then(() => {
          playButton.html('<i data-feather="pause"></i>');
          feather.replace();
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    } else {
      radioPlayer.pause();
      playButton.html('<i data-feather="play"></i>');
      feather.replace();
    }
  });

  // Handle audio errors
  radioPlayer.addEventListener("error", function (e) {
    console.error("Audio Error:", e);
    alert("Terjadi kesalahan saat memuat audio stream");
  });
});
