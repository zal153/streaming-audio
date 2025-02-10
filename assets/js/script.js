document.getElementById("currentYear").textContent = new Date().getFullYear();

function updateDateTime() {
  document.getElementById("currentDateTime").textContent =
    new Date().toLocaleString("id-ID");
}

// Panggil updateDateTime setiap detik (1000 ms)
setInterval(updateDateTime, 1000);
updateDateTime(); // Panggilan awal untuk segera menampilkan waktu saat halaman dimuat

const audioPlayer = document.getElementById("audioPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const togglePlaylist = document.getElementById("togglePlaylist");
const playlist = document.getElementById("playlist");

let elapsedTime = 0; // Durasi dalam detik
let timer;

function updateElapsedTime() {
  elapsedTime++;
  const minutes = Math.floor(elapsedTime / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedTime % 60).toString().padStart(2, "0");
  document.getElementById("elapsedTime").textContent = `${minutes}:${seconds}`;
}

playPauseButton.addEventListener("click", function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="fa fa-pause"></i>';
    timer = setInterval(updateElapsedTime, 1000);
  } else {
    audioPlayer.pause();
    playPauseButton.innerHTML = '<i class="fa fa-play"></i>';
    clearInterval(timer);
  }
});

togglePlaylist.addEventListener("click", function () {
  if (playlist.style.display === "none" || playlist.style.display === "") {
    playlist.style.display = "block";
  } else {
    playlist.style.display = "none";
  }
});

window.addEventListener("beforeunload", function () {
  clearInterval(timer); // Menghentikan timer saat halaman di-refresh atau ditutup
});

// Mode Gelap / Terang
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "on") {
  $("body").addClass("dark-mode");
  $("#toggleMode").html('<i class="fas fa-sun"></i>');
} else {
  $("#toggleMode").html('<i class="fas fa-moon"></i>');
}

$("#toggleMode").click(function () {
  $("body").toggleClass("dark-mode");
  let isDark = $("body").hasClass("dark-mode");
  localStorage.setItem("darkMode", isDark ? "on" : "off");
  $("#toggleMode").html(
    isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'
  );
});

$(document).ready(function () {
  function updateSong() {
    $.getJSON("http://localhost:5000/current-song", function (data) {
      console.log("Data diterima:", data);
      $("#songTitle").text(data.song || "Tidak ada lagu yang sedang diputar");
      $("#artistName").text(data.artist || "Tidak diketahui");
      $("#songDuration").text(data.duration || "N/A");
    }).fail(function () {
      $("#songTitle").text("Gagal mengambil informasi lagu");
      $("#artistName").text("");
      $("#songDuration").text("N/A");
    });
  }

  updateSong();
  setInterval(updateSong, 5000);

  function updatePlaylist() {
    $.getJSON("http://localhost:5000/playlist", function (data) {
      console.log("Data diterima:", data);
      if (Array.isArray(data)) {
        let nextSongs = $("#nextSongs");
        nextSongs.empty();
        data.forEach(function (song) {
          nextSongs.append("<li>" + song.song + " - " + song.artist + "</li>");
        });
      } else {
        console.error("Data bukan array:", data);
        $("#nextSongs").html("<li>Tidak ada informasi</li>");
      }
    }).fail(function () {
      $("#nextSongs").html("<li>Gagal mengambil informasi playlist</li>");
    });
  }

  updatePlaylist(); // Call updatePlaylist function to populate the playlist

  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "on") {
    $("body").addClass("dark-mode");
    $("#toggleMode").html('<i class="fas fa-sun"></i>');
  } else {
    $("#toggleMode").html('<i class="fas fa-moon"></i>');
  }

  $("#toggleMode").click(function () {
    $("body").toggleClass("dark-mode");
    let isDark = $("body").hasClass("dark-mode");
    localStorage.setItem("darkMode", isDark ? "on" : "off");
    $("#toggleMode").html(
      isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'
    );
  });
});
