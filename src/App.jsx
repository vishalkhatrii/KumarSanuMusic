import { useEffect, useRef, useState } from "react";
import "./App.css";

const songs = [
  { title: "Pehla Nasha", movie: "Jo Jeeta Wohi Sikandar", file: "/music/song1.wav" },
  { title: "Do Dil Mil Rahe Hain", movie: "Pardes", file: "/music/song2.wav" },
  { title: "Ek Ladki Ko Dekha", movie: "1942: A Love Story", file: "/music/song3.wav" },
  { title: "Mera Dil Bhi Kitna Pagal Hai", movie: "Saajan", file: "/music/song4.wav" },
  { title: "Tum Mile Dil Khile", movie: "Criminal", file: "/music/song5.wav" },
  { title: "Kuch Na Kaho", movie: "1942: A Love Story", file: "/music/song6.wav" },
];

function timeText(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  const secondsText = seconds < 10 ? "0" + seconds : String(seconds);

  return minutes + ":" + secondsText;
}

export default function App() {
  const audio = useRef(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [playlist, setPlaylist] = useState(true);
  const [error, setError] = useState("");

  const song = songs[index];

  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;

    player.pause();
    player.currentTime = 0;
    setElapsed(0);
    setDuration(0);

    if (playing) {
      player.play().catch(() => {
        setPlaying(false);
        setError("Audio nahi chali. public/music folder mein WAV files check karo.");
      });
    }
  }, [index]);

  async function togglePlay() {
    const player = audio.current;
    if (!player) return;

    if (playing) {
      player.pause();
      setPlaying(false);
      return;
    }

    try {
      await player.play();
      setPlaying(true);
      setError("");
    } catch {
      setPlaying(false);
      setError("Audio nahi chali. File names aur public/music folder check karo.");
    }
  }

  function selectSong(nextIndex) {
    setError("");
    setIndex((nextIndex + songs.length) % songs.length);
    setPlaying(true);
  }

  function nextSong() {
    if (shuffle && songs.length > 1) {
      let next = index;

      while (next === index) {
        next = Math.floor(Math.random() * songs.length);
      }

      selectSong(next);
    } else {
      selectSong(index + 1);
    }
  }

  function previousSong() {
    if (audio.current && audio.current.currentTime > 3) {
      audio.current.currentTime = 0;
      setElapsed(0);
    } else {
      selectSong(index - 1);
    }
  }

  function handleEnded() {
    if (repeat && audio.current) {
      audio.current.currentTime = 0;
      audio.current.play().catch(() => setPlaying(false));
    } else {
      nextSong();
    }
  }

  return (
    <main className="app" id="home">
      <div className="scene" aria-hidden="true">
        <div className="moon" />
        <div className="stars">✦　·　✧　·　✦　·　✧　·　✦</div>
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="mountain mountain-a" />
        <div className="mountain mountain-b" />
        <div className="mountain mountain-c" />
        <div className="mist mist-a" />
        <div className="mist mist-b" />
        <div className="highway" />
        <div className="road-markings" />
      </div>

      <header className="topbar">
        <a href="#home" className="brand">
          <span className="brand-icon">♫</span>
          <span>
            MELODY<span className="brand-light">ROADS</span>
          </span>
        </a>
        <span className="top-note">
          <i /> YOUR MUSIC ESCAPE
        </span>
      </header>

      <section className="hero">
        <p className="eyebrow">— &nbsp; THE GOLDEN ERA OF ROMANCE &nbsp; —</p>

        <h1>
          Safar bhi <em>haseen,</em>
          <br />
          gaane bhi <em>haseen.</em>
        </h1>

        <p className="hero-copy">
          Mountains, open roads, and timeless melodies.
          <br />
          Let the journey take you somewhere beautiful.
        </p>

        <section className="player">
          <div className="song-header">
            <div className="album">
              <div className="album-moon" />
              <div className="album-mountains" />
              <span>MELODIES</span>
            </div>

            <div className="song-info">
              <div className="playing-label">
                <span className={playing ? "bars active" : "bars"}>
                  <i /><i /><i /><i />
                </span>
                {playing ? "NOW PLAYING" : "READY TO PLAY"}
              </div>

              <h2>{song.title}</h2>
              <p>{song.movie} · Kumar Sanu collection</p>
              <small>TRACK {String(index + 1).padStart(2, "0")} / 06</small>
            </div>
          </div>

          <div className="progress-wrap">
            <input
              className="progress"
              aria-label="Song progress"
              type="range"
              min="0"
              max={duration || 1}
              step="0.1"
              value={Math.min(elapsed, duration || 1)}
              onChange={(e) => {
                if (audio.current && duration) {
                  audio.current.currentTime = Number(e.target.value);
                  setElapsed(Number(e.target.value));
                }
              }}
              style={{
                "--progress":
                  (duration ? (elapsed / duration) * 100 : 0) + "%",
              }}
            />

            <div className="time-row">
              <span>{timeText(elapsed)}</span>
              <span>{timeText(duration)}</span>
            </div>
          </div>

          <div className="controls">
            <button
              className={shuffle ? "icon-button selected" : "icon-button"}
              onClick={() => setShuffle(!shuffle)}
              aria-label="Shuffle"
              title="Shuffle"
            >
              ⤨
            </button>

            <button
              className="icon-button"
              onClick={previousSong}
              aria-label="Previous song"
              title="Previous"
            >
              |◀
            </button>

            <button
              className="play-button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>

            <button
              className="icon-button"
              onClick={nextSong}
              aria-label="Next song"
              title="Next"
            >
              ▶|
            </button>

            <button
              className={repeat ? "icon-button selected" : "icon-button"}
              onClick={() => setRepeat(!repeat)}
              aria-label="Repeat"
              title="Repeat"
            >
              ↻
            </button>
          </div>

          <div className="volume-row">
            <span>♫</span>

            <input
              className="volume"
              aria-label="Volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ "--volume": volume * 100 + "%" }}
            />

            <button
              className="playlist-toggle"
              onClick={() => setPlaylist(!playlist)}
            >
              ☷ {playlist ? "HIDE PLAYLIST" : "PLAYLIST"}
            </button>
          </div>

          {error && (
            <p className="error-message" role="status">
              {error}
            </p>
          )}

          {playlist && (
            <div className="playlist">
              <div className="playlist-heading">
                <span>KUMAR SANU COLLECTION</span>
                <span>06 SONGS</span>
              </div>

              {songs.map((item, i) => (
                <button
                  key={item.file}
                  className={"playlist-item " + (index === i ? "current" : "")}
                  onClick={() => selectSong(i)}
                >
                  <span className="track-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="track-details">
                    <strong>{item.title}</strong>
                    <small>{item.movie}</small>
                  </span>

                  <span className="track-action">
                    {index === i && playing ? "Ⅱ" : "▶"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <button className="journey-button" onClick={togglePlay}>
          <span>{playing ? "Ⅱ" : "▶"}</span>
          {playing ? "PAUSE THE JOURNEY" : "START YOUR JOURNEY"}
        </button>

        <p className="footer-note">HEADPHONES ON · WORLD OFF</p>
      </section>

      <div className="truck" aria-label="Indian decorated goods carrier truck">
        <img
          src="/images/indian-truck.png"
          alt="Colourfully decorated Indian truck"
        />
      </div>

      <footer className="footer">
        <span>MADE FOR THE LOVE OF MUSIC</span>
        <span>✦ &nbsp; MELODYROADS &nbsp; ✦</span>
      </footer>

      <audio
        ref={audio}
        src={song.file}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const value = e.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onDurationChange={(e) => {
          const value = e.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          setError("");
        }}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        onError={() => {
          setPlaying(false);
          setError(
            "Audio file nahi mili. public/music folder mein song1.wav se song6.wav check karo."
          );
        }}
      />
    </main>
  );
}