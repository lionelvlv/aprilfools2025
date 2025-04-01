import React, { useEffect, useState, useRef } from "react";

const images = {
  jordan: [
    "/jordan/1.JPG", "/jordan/2.JPG", "/jordan/3.jpg", "/jordan/4.jpg", "/jordan/5.jpg",
    "/jordan/6.jpg", "/jordan/7.jpg", "/jordan/8.jpg", "/jordan/9.JPG", "/jordan/10.JPG",
    "/jordan/11.JPG", "/jordan/12.jpg", "/jordan/13.jpg", "/jordan/14.jpg", "/jordan/15.JPG",
    "/jordan/16.jpeg", "/jordan/17.jpg", "/jordan/18.jpg"
  ],
  lionel: [
    "/lionel/1.jpg", "/lionel/2.jpg", "/lionel/3.jpg", "/lionel/4.jpg",
    "/lionel/5.jpg", "/lionel/6.jpg", "/lionel/7.jpg", "/lionel/8.jpg",
    "/lionel/9.jpg", "/lionel/10.jpg", "/lionel/11.jpg", "/lionel/12.jpg",
    "/lionel/13.jpg", "/lionel/14.jpg", "/lionel/15.jpg", "/lionel/16.jpg",
    "/lionel/17.jpg", "/lionel/18.jpg"
  ]
};

const allImagePaths = [...images.jordan, ...images.lionel];

export default function GuessingGame() {
  const [score, setScore] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [usedImages, setUsedImages] = useState([]);

  const bgmRef = useRef(null);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);

  useEffect(() => {
    if (gameStarted) {
      loadNewImage();
      bgmRef.current?.play();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameOver) {
      bgmRef.current?.pause();
      bgmRef.current.currentTime = 0;
    }
  }, [gameOver]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameOver && gameStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && !gameOver) {
      setShowResult(true);
      setGameOver(true);
      setTimeout(() => wrongSound.current?.play(), 100);
    }
  }, [timeLeft, showResult, gameOver, gameStarted]);

  const loadNewImage = () => {
    const availableImages = allImagePaths.filter((img) => !usedImages.includes(img));
    if (availableImages.length === 0) {
      setGameOver(true);
      return;
    }
    const img = availableImages[Math.floor(Math.random() * availableImages.length)];
    const category = img.includes("jordan") ? "jordan" : "lionel";
    setUsedImages((prev) => [...prev, img]);
    setCorrectAnswer(category);
    setCurrentImage(img);
    setTimeLeft(10);
    setShowResult(false);
  };

  const handleGuess = (guess) => {
    if (guess === correctAnswer) {
      setScore(score + 1);
      correctSound.current?.play();
      setShowResult(true);
    } else {
      setShowResult(true);
      setGameOver(true);
      setTimeout(() => wrongSound.current?.play(), 100);
    }
  };

  const nextRound = () => {
    if (!gameOver) {
      loadNewImage();
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setUsedImages([]);
    loadNewImage();
    bgmRef.current?.play();
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setUsedImages([]);
    setGameStarted(true);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "1rem",
    boxSizing: "border-box",
    textAlign: "center",
    backgroundColor: "black",
    color: "lime",
    fontFamily: "'Courier New', monospace",
    position: "relative"
  };

  const cardStyle = {
    backgroundColor: "black",
    border: "4px double #00f",
    color: "lime",
    borderRadius: "0",
    width: "100%",
    maxWidth: "500px",
    height: "600px",
    padding: "1rem",
    marginTop: "1rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    border: "2px outset #0ff",
    backgroundColor: "#222",
    color: "lime",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0.5rem",
    fontFamily: "inherit"
  };

  const imgStyle = {
    width: "100%",
    height: "auto",
    aspectRatio: "1.5",
    objectFit: "cover",
    border: "2px solid #0ff",
    marginBottom: "1rem"
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Who's That?</h1>

      {!gameStarted ? (
        <button onClick={startGame} style={buttonStyle}>Play</button>
      ) : (
        <div style={cardStyle}>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>⏱️ {timeLeft}s</p>
            <img
              src={currentImage}
              alt="Guess who"
              style={imgStyle}
            />
          </div>
          {!showResult ? (
            <div>
              <button style={buttonStyle} onClick={() => handleGuess("jordan")}>Jordan</button>
              <button style={buttonStyle} onClick={() => handleGuess("lionel")}>Lionel</button>
            </div>
          ) : gameOver ? (
            <div>
              <p style={{ color: "red", fontWeight: "bold" }}>Game Over! It was {correctAnswer.toUpperCase()}.</p>
              <button style={buttonStyle} onClick={resetGame}>Play Again</button>
            </div>
          ) : (
            <div>
              <p style={{ color: "lime", fontWeight: "bold" }}>Correct! It was {correctAnswer.toUpperCase()}.</p>
              <button style={buttonStyle} onClick={nextRound}>Next</button>
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: "1rem" }}>Score: {score}</p>

      {/* Sound Effects */}
      <audio ref={bgmRef} loop src="/audio/bgm.mp3" />
      <audio ref={correctSound} src="/audio/correct.mp3" />
      <audio ref={wrongSound} src="/audio/wrong.mp3" />

      {/* CRT Scanlines */}
      <div style={{
        background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 2px)",
        mixBlendMode: "overlay",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 999
      }} />
    </div>
  );
}
