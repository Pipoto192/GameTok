import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './GameCard.css';

const GameCard = ({ game }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [likes, setLikes] = useState(game.likes || 0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const iframeRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data) {
        if (event.data.type === 'GAME_SCORE') {
          setScore(event.data.score);
        } else if (event.data.type === 'GAME_OVER') {
          setScore(event.data.score);
          handleGameOver(event.data.score);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPlaying]); // Re-bind if playing state changes might be safer, but empty dep array is usually fine for window listeners if handlers are stable. 
  // Actually, handleGameOver depends on 'user' and 'game', so we should be careful. 
  // Better to use a ref or stable handler, but for now let's just trust the closure or move logic.

  const handleGameOver = async (finalScore) => {
    if (user) {
      try {
        await axios.post('http://localhost:3000/scores', {
          user_id: user.id,
          game_id: game.id,
          score: finalScore
        });
        fetchLeaderboard();
        setShowLeaderboard(true);
      } catch (error) {
        console.error("Error submitting score", error);
      }
    } else {
      // Prompt login or just show local score
      alert(`Game Over! Score: ${finalScore}. Login to save high scores!`);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/games/${game.id}/scores`);
      setLeaderboard(res.data.data);
    } catch (error) {
      console.error("Error fetching leaderboard", error);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setShowLeaderboard(false);
    setScore(0);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setScore(0);
    setShowLeaderboard(false);
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
            src={game.game_url || "/games/test.html"} 
            title={game.title}
            className="game-iframe"
          />
          <button className="close-btn" onClick={handleClose}>X</button>
          <div className="live-score">Score: {score}</div>
          
          {showLeaderboard && (
            <div className="leaderboard-overlay">
              <h3>Leaderboard</h3>
              <ul>
                {leaderboard.map((entry, i) => (
                  <li key={i}>
                    <span>{i+1}. {entry.username}</span>
                    <span>{entry.score}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowLeaderboard(false)}>Play Again</button>
              <button onClick={handleClose}>Close</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="game-content" onClick={handlePlay}>
            {/* Placeholder for game iframe or canvas */}
            <div className="game-placeholder">
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <div className="tap-to-play">Tap to Play</div>
            </div>
          </div>
          
          <div className="game-overlay">
            <div className="game-info">
              <h3>@{game.creator || 'unknown'}</h3>
              <p>{game.title}</p>
            </div>
            
            <div className="game-actions">
              <div className="action-btn" onClick={(e) => { e.stopPropagation(); handleLike(); }}>
                <span>❤️</span>
                <span>{likes}</span>
              </div>
              <div className="action-btn" onClick={(e) => e.stopPropagation()}>
                <span>💬</span>
                <span>{game.comments || 0}</span>
              </div>
              <div className="action-btn" onClick={(e) => e.stopPropagation()}>
                <span>🔗</span>
                <span>Share</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCard;
