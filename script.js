// 🎵 Global Player Elements (only exist on index.html)
const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volumeControl");

// Track Info Section Elements
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const trackAlbum = document.getElementById("trackAlbum");
const trackImage = document.getElementById("trackImage");

// Sidebar Preview Elements
const trackTitleInfo = document.getElementById("trackTitleInfo");
const trackArtistInfo = document.getElementById("trackArtistInfo");
const albumArt = document.getElementById("albumArt");

// Playlist Sources
let playlist = [];
let currentIndex = 0;

async function fetchSongs(query = "Arijit Singh") {
  const res = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      "x-rapidapi-key": "5d0c85671cmsh65398914b175a95p1440c8jsn6c6f1b4afb12"
    }
  });

  const data = await res.json();
  playlist = data.data.map(track => ({
    title: track.title,
    artist: track.artist.name,
    album: track.album.title,
    cover: track.album.cover_medium,
    src: track.preview 
  }));

  renderSearchResults();

  if (playlist.length > 0) {
    currentIndex = 0;
    loadSong(currentIndex);
  }
}

// Display search results
function renderSearchResults() {
  const container = document.getElementById("searchResults");
  if (!container) return;

  container.innerHTML = "";
  playlist.forEach((song, i) => {
    const div = document.createElement("div");
    div.className = "search-item";
    div.innerHTML = `
      <img src="${song.cover}" alt="cover" class="search-cover">
      <div class="search-info">
        <p><b>${song.title}</b> - ${song.artist}</p>
        <span>⏱ ${formatTime(song.duration || 30)}</span>
      </div>
    `;
    div.onclick = () => playFromSearch(i);
    container.appendChild(div);
  });
}

function playFromSearch(index) {
  currentIndex = index;
  loadSong(currentIndex);
}


function loadSong(index) {
  const song = playlist[index];
  if (!song) return;

  if (audio) {
    audio.src = song.src;
  }

  // Update Track Info section
  if (trackTitle) trackTitle.textContent = song.title;
  if (trackArtist) trackArtist.textContent = song.artist;
  if (trackAlbum) trackAlbum.textContent = song.album;
  if (trackImage) trackImage.src = song.cover;

  // Update Sidebar Preview
  if (trackTitleInfo) trackTitleInfo.textContent = song.title;
  if (trackArtistInfo) trackArtistInfo.textContent = song.artist;
  if (albumArt) albumArt.src = song.cover;

  if (playBtn) playBtn.textContent = "▶";
}



function playSong() {
  if (!audio) return;
  audio.play();
  if (playBtn) playBtn.textContent = "⏸";
}

function pauseSong() {
  if (!audio) return;
  audio.pause();
  if (playBtn) playBtn.textContent = "▶";
}

function togglePlay() {
  if (!audio) return;
  if (audio.paused) playSong();
  else pauseSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
}

function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
}

// Progress & Volume
if (audio) {
  audio.addEventListener("timeupdate", () => {
    if (audio.duration && progressBar) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    }
  });


  progressBar?.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  volumeControl?.addEventListener("input", () => {
    audio.volume = volumeControl.value / 100;
  });

  audio.addEventListener("ended", nextSong);
}

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  fetchSongs("Arijit Singh");
  playBtn?.addEventListener("click", togglePlay);
  prevBtn?.addEventListener("click", prevSong);
  nextBtn?.addEventListener("click", nextSong);
});



const addToPlaylistBtn = document.getElementById("addToPlaylistBtn");

if (addToPlaylistBtn) {
  addToPlaylistBtn.addEventListener("click", () => {
    const song = playlist[currentIndex];
    if (!song) return;

    // Get stored playlists
    let savedPlaylists = JSON.parse(localStorage.getItem("userPlaylist")) || [];

    // Prevent duplicates
    if (!savedPlaylists.some(s => s.title === song.title && s.artist === song.artist)) {
      savedPlaylists.push(song);
      localStorage.setItem("userPlaylist", JSON.stringify(savedPlaylists));
      alert(`${song.title} added to playlist!`);
    } else {
      alert("This song is already in your playlist.");
    }
  });
}
