import './Discover.css';

const Discover = () => {
  return (
    <div className="discover-container">
      <div className="search-bar">
        <input type="text" placeholder="Search games, users..." />
      </div>
      <div className="categories">
        <h3>Trending</h3>
        <div className="game-grid">
          {/* Placeholders for trending games */}
          <div className="game-card-small">Game 1</div>
          <div className="game-card-small">Game 2</div>
          <div className="game-card-small">Game 3</div>
          <div className="game-card-small">Game 4</div>
        </div>
        
        <h3>New</h3>
        <div className="game-grid">
          <div className="game-card-small">Game 5</div>
          <div className="game-card-small">Game 6</div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
