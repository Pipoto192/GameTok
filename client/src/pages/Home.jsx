import { useState, useEffect } from 'react';
import axios from 'axios';
import GameCard from '../components/GameCard';
import './Home.css';

const Home = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/games');
        if (response.data && response.data.data) {
          // Map backend data to frontend format if needed, or just use it
          // Adding color for visual distinction as it's not in DB yet
          const gamesWithColor = response.data.data.map((game, index) => ({
            ...game,
            color: ['#70c5ce', '#edc22e', '#4caf50', '#9c27b0'][index % 4]
          }));
          setGames(gamesWithColor);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        // Fallback to mock data
        const mockGames = [
          { id: 1, title: 'Flappy Bird Clone', description: 'Tap to fly', color: '#70c5ce', likes: 120, comments: 45, creator: 'flappy_dev' },
          { id: 2, title: '2048', description: 'Join the numbers', color: '#edc22e', likes: 890, comments: 12, creator: 'math_wiz' },
          { id: 3, title: 'Snake', description: 'Eat the apples', color: '#4caf50', likes: 340, comments: 8, creator: 'retro_gamer' },
          { id: 4, title: 'Tetris', description: 'Stack the blocks', color: '#9c27b0', likes: 560, comments: 23, creator: 'block_master' },
        ];
        setGames(mockGames);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="feed-container">
      {games.map((game) => (
        <div key={game.id} className="feed-item">
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
};

export default Home;
