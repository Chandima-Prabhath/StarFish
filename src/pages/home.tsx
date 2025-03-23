import React, {useEffect, useState} from "react";
import "./home.css";

function HomePage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);
  

  return (
    <div className="home-page scroll-page fade-in" data-oid="pr81wpk">
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="welcome-message">Hello, {username}!</h1>
        <p className="location-tag">
          Discover Events in <span className="city-name">New York City</span>
        </p>
      </header>

      {/* Event Categories */}
      <section className="event-categories">
        <h2>Categories</h2>
        <div className="categories-list">
          <button className="category-chip">Concerts</button>
          <button className="category-chip">Nightlife</button>
          <button className="category-chip">Sports</button>
          <button className="category-chip">Tech</button>
          <button className="category-chip">Food & Drinks</button>
          <button className="category-chip">Outdoor</button>
        </div>
      </section>

      {/* Trending Events */}
      <section className="trending-events">
        <h2>Trending Events</h2>
        <div className="card-carousel">
          <div className="event-card">
            <img src="https://placehold.co/150" alt="Jazz Night" />
            <div className="card-content">
              <h3>Jazz Night at The Club</h3>
              <p>2.5 mi | $20 | Dec 15</p>
            </div>
          </div>
          <div className="event-card">
            <img src="https://placehold.co/150" alt="Comedy Show" />
            <div className="card-content">
              <h3>Comedy Show</h3>
              <p>1.2 mi | Free | Dec 10</p>
            </div>
          </div>
          {/* Add more cards as needed */}
        </div>
      </section>

      {/* Recommended Events */}
      <section className="recommended-events">
        <h2>Recommended for You</h2>
        <div className="card-carousel">
          <div className="event-card">
            <img src="https://placehold.co/150" alt="Art Expo" />
            <div className="card-content">
              <h3>Art Expo</h3>
              <p>3 mi | Free | Dec 20</p>
            </div>
          </div>
          <div className="event-card">
            <img src="https://placehold.co/150" alt="NBA Game" />
            <div className="card-content">
              <h3>NBA Game</h3>
              <p>5 mi | $50 | Dec 18</p>
            </div>
          </div>
          {/* Add more cards as needed */}
        </div>
      </section>

      {/* Map Preview */}
      <section className="map-view">
        <h2>Explore on Map</h2>
        <div className="map-placeholder">
          <img
            src="https://placehold.co/300x200"
            alt="Map Preview"
            className="map-image"
          />
          <button className="btn use-my-location">Use My Location</button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
