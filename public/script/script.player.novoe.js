// === Плеер радио newradio.md (интеграция с текущей версткой, без CORS и ошибок) ===

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  audio.src = "https://stream.newradio.md/stream";
  audio.volume = 0.5;
  audio.preload = "none";

  const playButton = document.getElementById("playPauseButton");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const volumeSlider = document.getElementById("volumeSlider");
  const trackTitle = document.getElementById("now-playing");

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => {
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
        })
        .catch(err => {
          console.error("Ошибка при попытке воспроизведения:", err);
        });
    } else {
      audio.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = parseFloat(volumeSlider.value);
  });

  function getMetadata() {
    fetch("https://api.newradio.md/items/now_playing?sort=-played_at&limit=1")
      .then((response) => response.json())
      .then((json) => {
        const trackData = json.data[0];
        if (trackData) {
          const track = `${trackData.artist} — ${trackData.title}`;
          trackTitle.textContent = track;
        }
      })
      .catch((error) => {
        console.error("Ошибка получения метаданных:", error);
      });
  }

  getMetadata();
  setInterval(getMetadata, 10000);
});
