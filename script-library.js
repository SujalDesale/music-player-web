// 🎵 Local Library
let playlist = [
  { title: "Song 1", artist: "Artist A", album: "Album A", cover: "assets/cover.jpg", src: "assets/audio1.mp3" },
  { title: "Song 2", artist: "Artist B", album: "Album B", cover: "assets/cover2.jpg", src: "assets/audio1.mp3" }
];
let currentIndex = 0;

const audio = document.getElementById("audioPlayer");

const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const trackAlbum = document.getElementById("trackAlbum");
const trackImage = document.getElementById("trackImage");

const trackTitleInfo = document.getElementById("trackTitleInfo");
const trackArtistInfo = document.getElementById("trackArtistInfo");
const albumArt = document.getElementById("albumArt");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volumeControl");

// Render Library
function loadLibrary() {
  const container = document.getElementById("playlistContainer");
  container.innerHTML = "";

  playlist.forEach((song, i) => {
    const div = document.createElement("div");
    div.className = "search-item"; 
    div.innerHTML = `
      <img src="${song.cover}" alt="cover" class="search-cover">
      <div class="search-info">
        <p><b>${song.title}</b> - ${song.artist}</p>
        <span>${song.album}</span>
      </div>
    `;
    div.onclick = () => playSongFromLibrary(i);
    container.appendChild(div);
  });
}

function playSongFromLibrary(index) {
  currentIndex = index;
  loadSong(currentIndex);
}

function loadSong(index) {
  const song = playlist[index];
  if (!song) return;

  audio.src = song.src;

  // Track Info
  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;
  trackAlbum.textContent = song.album;
  trackImage.src = song.cover;

  // Now Playing Sidebar
  trackTitleInfo.textContent = song.title;
  trackArtistInfo.textContent = song.artist;
  albumArt.src = song.cover;

  playSong();
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
}
function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
}
function togglePlay() {
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

// Progress + Volume
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});
progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value / 100;
});
audio.addEventListener("ended", nextSong);

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Search filter
function filterLibrary() {
  const query = document.getElementById("librarySearch").value.toLowerCase();
  const container = document.getElementById("playlistContainer");
  container.innerHTML = "";

  playlist
    .filter(song => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query))
    .forEach((song, i) => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `
        <img src="${song.cover}" alt="cover" class="search-cover">
        <div class="search-info">
          <p><b>${song.title}</b> - ${song.artist}</p>
          <span>${song.album}</span>
        </div>
      `;
      div.onclick = () => playSongFromLibrary(i);
      container.appendChild(div);
    });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadLibrary();
  playBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", prevSong);
  nextBtn.addEventListener("click", nextSong);
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
