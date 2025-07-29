const API_BASE = "https://api.newradio.md";

async function fetchNewSongs() {
  try {
    const newSongsRes = await fetch(`${API_BASE}/items/new_songs?sort=-date_created&limit=8`);
    const newSongsData = await newSongsRes.json();
    const codes = newSongsData.data.map(song => song.code);

    const songBlocks = document.querySelectorAll(".new-song");

    // Загружаем инфу по каждому коду
    const songs = await Promise.all(
      codes.map(async (code) => {
        const res = await fetch(`${API_BASE}/items/music_base?filter[code][_eq]=${code}`);
        const data = await res.json();
        return data.data[0]; // предполагаем, что один объект
      })
    );

    // Вставляем каждый трек в соответствующий .new-song
songs.forEach((song, index) => {
  const block = songBlocks[index];
  if (!block || !song) return;

  // Собираем строку для <img>
  const coverSrc = `${API_BASE}/assets/${song.cover}`;
  const demoSrc = song.demo ? `${API_BASE}/assets/${song.demo}` : null;

  // Генерируем HTML
  block.innerHTML = `
      <div class="cover-wrapper">
    <img src="${coverSrc}" alt="${song.title}" class="cover">
    ${demoSrc ? `
      <div class="play-overlay">
        <svg class="icon play-icon" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg class="icon pause-icon" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </div>` : ""}
  </div>
    <div class="text">
      <div class="artist">${song.artist}</div><br>
      <div class="title">${song.title}</div>
    </div>
  `;

  // Навешиваем клик на демо
if (demoSrc) {
  const wrapper = block.querySelector(".cover-wrapper");
  wrapper.addEventListener("click", () => {
    playDemo(demoSrc, wrapper);
  });
}
});

function playDemo(url, wrapper) {
  const demo = document.getElementById("demo-player");
  const main = document.getElementById("audio");

  if (!main.paused) {
    main.pause();
    main.src = "";
    document.getElementById("playIcon").style.display = "block";
    document.getElementById("pauseIcon").style.display = "none";
  }

  // Убираем .playing со всех блоков
  document.querySelectorAll(".cover-wrapper.playing").forEach(w => w.classList.remove("playing"));

  if (demo.src !== url) {
    demo.src = url;
    demo.volume = 0.5;
    demo.play();
    wrapper.classList.add("playing");
  } else if (demo.paused) {
    demo.volume = 0.5;
    demo.play();
    wrapper.classList.add("playing");
  } else {
    demo.pause();
    demo.currentTime = 0;
    wrapper.classList.remove("playing");
  }
}

document.getElementById("demo-player").addEventListener("ended", () => {
  // Когда демо доиграло — убираем .playing
  document.querySelectorAll(".cover-wrapper.playing").forEach(el => {
    el.classList.remove("playing");
  });
});


  } catch (err) {
    console.error("Ошибка загрузки новинок:", err);
  }
}

fetchNewSongs();