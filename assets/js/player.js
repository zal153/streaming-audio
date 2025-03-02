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
  let autoplayAttempted = false;

  if ($("#volumeButton").length === 0) {
    $(".controls").append(
      '<button id="volumeButton"><i data-feather="volume-2"></i></button>'
    );
  }

  let volumeButton = $("#volumeButton");
  let isMuted = false;
  feather.replace();

  // Tambahkan pesan autoplay
  let autoplayMessage = $(
    '<div class="autoplay-message">Klik play untuk mulai mendengarkan</div>'
  );
  $(".player-card").prepend(autoplayMessage);
  autoplayMessage.hide();

  function playAudio() {
    autoplayMessage.hide();
    radioPlayer
      .play()
      .then(() => {
        playButton.html('<i data-feather="pause"></i>');
        if (isMuted) {
          volumeButton.html('<i data-feather="volume-x"></i>');
        } else {
          volumeButton.html('<i data-feather="volume-2"></i>');
        }
        feather.replace();
        autoplayAttempted = true;
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
        playButton.html('<i data-feather="play"></i>');
        autoplayMessage.show();
        feather.replace();
        autoplayAttempted = true;
      });
  }

  function setupAutoplayWithUserGesture() {
    const userGestures = ["click", "touchstart", "keydown"];

    function userGestureHandler() {
      if (!autoplayAttempted && radioPlayer.paused) {
        playAudio();
      }

      userGestures.forEach((event) => {
        document.removeEventListener(event, userGestureHandler);
      });
    }

    userGestures.forEach((event) => {
      document.addEventListener(event, userGestureHandler, { once: true });
    });
  }

  radioPlayer.muted = false;
  radioPlayer
    .play()
    .then(() => {
      playButton.html('<i data-feather="pause"></i>');
      feather.replace();
      autoplayAttempted = true;
    })
    .catch((error) => {
      console.error("Autoplay failed:", error);
      // Jika autoplay gagal, mungkin karena kebijakan browser, coba dengan muted
      radioPlayer.muted = true;
      isMuted = true;

      radioPlayer
        .play()
        .then(() => {
          playButton.html('<i data-feather="pause"></i>');
          volumeButton.html('<i data-feather="volume-x"></i>');
          feather.replace();
          autoplayMessage.text(
            "Audio dimulai tanpa suara. Klik ikon volume untuk mendengarkan."
          );
          autoplayMessage.show();
          autoplayAttempted = true;
        })
        .catch((error) => {
          console.error("Muted autoplay failed:", error);
          playButton.html('<i data-feather="play"></i>');
          autoplayMessage.text("Klik play untuk mulai mendengarkan");
          autoplayMessage.show();
          feather.replace();
          // Setup autoplay yang akan dipicu oleh interaksi pengguna
          setupAutoplayWithUserGesture();
        });
    });

  // Handle volume button clicks - tambahkan console.log untuk debugging
  volumeButton.click(function () {
    console.log("Volume button clicked");

    if (radioPlayer.paused) {
      playAudio();
    }

    if (isMuted) {
      radioPlayer.muted = false;
      volumeButton.html('<i data-feather="volume-2"></i>');
      isMuted = false;
      console.log("Unmuted audio");
    } else {
      radioPlayer.muted = true;
      volumeButton.html('<i data-feather="volume-x"></i>');
      isMuted = true;
      console.log("Muted audio");
    }
    feather.replace();
  });

  // Handle play/pause button clicks
  playButton.click(function () {
    if (radioPlayer.paused) {
      playAudio();
    } else {
      radioPlayer.pause();
      playButton.html('<i data-feather="play"></i>');
      feather.replace();
    }
  });

  if (!navigator.onLine) {
    $("#songImage").attr("src", "assets/images/ilm_1.jpg");
    $("#miniImage").attr("src", "assets/images/ilm_1.jpg");
  }

  function fetchRandomImage() {
    let apiKey = "Dd_5WkW9QCvYStPCSV3QEwylDbloNBTpwNV5to51dlg";
    let searchUrl = `https://api.unsplash.com/photos/random?query=music&client_id=${apiKey}`;

    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.urls && data.urls.regular) {
          $("#songImage").attr("src", data.urls.regular);
          $("#miniImage").attr("src", data.urls.regular);
        } else {
          console.error("No image found");
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }

  let currentSongTitle = ""; // Simpan lagu sebelumnya

  function updateSong() {
    $.getJSON("script.php")
      .done(function (data) {
        if (data.error) {
          $("#songTitle, #miniTitle").text(data.error);
          $("#artistName, #miniArtist").text("");
        } else {
          const songTitle = data.song || "Tidak ada lagu yang sedang diputar";
          const artistName = data.artist || "Tidak diketahui";

          // Jika lagu berubah, update tampilan & ambil gambar baru
          if (songTitle !== currentSongTitle) {
            currentSongTitle = songTitle; // Simpan lagu terbaru
            $("#songTitle, #miniTitle").text(songTitle);
            $("#artistName, #miniArtist").text(artistName);

            // Update Media Session API for better integration
            updateMediaSession(songTitle, artistName);

            // Ambil gambar baru hanya saat lagu berganti
            fetchRandomImage();
          }
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

  // Media Session API integration for better media controls
  function updateMediaSession(songTitle, artistName) {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songTitle,
        artist: artistName,
        album: "Radio Stream",
        artwork: [
          {
            src: $("#songImage").attr("src"),
            sizes: "300x300",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", function () {
        radioPlayer.play();
        playButton.html('<i data-feather="pause"></i>');
        feather.replace();
      });

      navigator.mediaSession.setActionHandler("pause", function () {
        radioPlayer.pause();
        playButton.html('<i data-feather="play"></i>');
        feather.replace();
      });
    }
  }

  updateSong();
  setInterval(updateSong, 5000);

  // Handle audio errors
  radioPlayer.addEventListener("error", function (e) {
    console.error("Audio Error:", e);
    alert("Terjadi kesalahan saat memuat audio stream");
  });

  // Log untuk memastikan tombol volume ada
  console.log("Volume button exists:", $("#volumeButton").length > 0);
  console.log("Controls element exists:", $(".controls").length > 0);
});
