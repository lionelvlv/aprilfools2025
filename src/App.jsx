import React, { useEffect, useState, useRef } from "react";

const images = {
  jordan: ["/jordan/1.jpg", "/jordan/2.jpg", "/jordan/3.jpg"],
  lionel: ["/lionel/1.jpg", "/lionel/2.jpg", "/lionel/3.jpg"]
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
      loadRandomImage();
      bgmRef.current?.play();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameOver && gameStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && !gameOver) {
      wrongSound.current?.play();
      setShowResult(true);
      setGameOver(true);
    }
  }, [timeLeft, showResult, gameOver, gameStarted]);

  const loadRandomImage = () => {
    const availableImages = allImagePaths.filter((img) => !usedImages.includes(img));
    if (availableImages.length === 0) {
      setGameOver(true);
      return;
    }
    const img = availableImages[Math.floor(Math.random() * availableImages.length)];
    const category = img.includes("jordan") ? "jordan" : "lionel";
    setUsedImages([...usedImages, img]);
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
      wrongSound.current?.play();
      setGameOver(true);
      setShowResult(true);
    }
  };

  const nextRound = () => {
    if (!gameOver) {
      loadRandomImage();
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setUsedImages([]);
    loadRandomImage();
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
    textAlign: "center"
  };

  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    borderRadius: "1rem",
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
    borderRadius: "0.75rem",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0.5rem"
  };

  const imgStyle = {
    width: "100%",
    height: "auto",
    aspectRatio: "1.5",
    objectFit: "cover",
    borderRadius: "1rem",
    marginBottom: "1rem"
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Who's That?</h1>

      {!gameStarted ? (
        <button
          onClick={startGame}
          style={{ ...buttonStyle, backgroundColor: "#10b981" }}
        >
          Play
        </button>
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
              <button
                style={{ ...buttonStyle, backgroundColor: "#3b82f6" }}
                onClick={() => handleGuess("jordan")}
              >
                Jordan
              </button>
              <button
                style={{ ...buttonStyle, backgroundColor: "#22c55e" }}
                onClick={() => handleGuess("lionel")}
              >
                Lionel
              </button>
            </div>
          ) : gameOver ? (
            <div>
              <p style={{ color: "#dc2626", fontWeight: "bold" }}>
                Game Over! It was {correctAnswer.toUpperCase()}.
              </p>
              <button
                style={{ ...buttonStyle, backgroundColor: "#374151" }}
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: "#16a34a", fontWeight: "bold" }}>
                Correct! It was {correctAnswer.toUpperCase()}.
              </p>
              <button
                style={{ ...buttonStyle, backgroundColor: "#2563eb" }}
                onClick={nextRound}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: "1rem" }}>Score: {score}</p>

      {/* Sound Effects */}
      <audio ref={bgmRef} loop src="/audio/bgm.mp3" />
      <audio ref={correctSound} src="/audio/correct.mp3" />
      <audio ref={wrongSound} src="/audio/wrong.mp3" />
    </div>
  );
}
