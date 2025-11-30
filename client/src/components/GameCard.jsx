import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GameCard.css';

const GameCard = ({ game }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [likes, setLikes] = useState(game.likes || 0);
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'GAME_SCORE') {
        setScore(event.data.score);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setScore(0); // Reset score or save it
  };

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:3000/games/${game.id}/like`);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Error liking game:', error);
    }
  };

  return (
    <div className="game-card" style={{ backgroundColor: game.color || '#333' }}>
      {isPlaying ? (
        <div className="game-player-container">
          <iframe 
            ref={iframeRef}
            src="/games/test.html" 
            title={game.title}
            className="game-iframe"
          />
          <button className="close-btn" onClick={handleClose}>X</button>
          <div className="live-score">Score: {score}</div>
        </div>
      ) : (
        <>
          <div className="game-content">
            {/* Placeholder for game iframe or canvas */}
            <div className="game-placeholder">
              <h2>{game.title}</h2>
              <p>{game.description}</p>
            </div>
          </div>
          
          <div className="game-overlay">
            <div className="game-info">
              <h3>@{game.creator || 'unknown'}</h3>
              <p>{game.title}</p>
            </div>
            
            <div className="game-actions">
              <div className="action-btn" onClick={handleLike}>
                <span>❤️</span>
                <span>{likes}</span>
              </div>
              <div className="action-btn">
                <span>💬</span>
                <span>{game.comments || 0}</span>
              </div>
              <div className="action-btn">
                <span>🔗</span>
                <span>Share</span>
              </div>
            </div>
          </div>
          
          <button className="play-btn-overlay" onClick={handlePlay}>Play</button>
        </>
      )}
    </div>
  );
};

export default GameCard;
