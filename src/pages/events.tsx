import { useEffect, useState } from "react";
import BackendApiClient from "../lib/BackendApiClient";
import { EventResponse, CategoryResponse } from "../lib/backendApi";
import "./events.css";

function EventsPage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<EventResponse[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await BackendApiClient.getEvents();
        setEvents(response);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    const fetchCategories = async () => {
      try {
        const response = await BackendApiClient.getEventCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchEvents();
    fetchCategories();
  }, []);

  // Update filtered events when events or search query change
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  return (
    <div className="events-page scroll-page fade-in">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Event Categories */}
      {categories.length > 0 && (
        <section className="event-categories">
          <h2>Categories</h2>
          <div className="categories-list">
            {categories.map((category, index) => (
                <button className="category-chip" key={index}>
                {category.category}
                </button>
            ))}
          </div>
        </section>
      )}

      {/* Trending Events */}
      {filteredEvents.length > 0 && (
        <section className="trending-events">
          <h2>Trending Events</h2>
          <div className="events-grid">
            {filteredEvents.map((event, index) => (
              <div className="event-card" key={index}>
                <div className="card-image">
                  <img
                    src={event.event_picture || "https://placehold.co/300x200"}
                    alt={event.title}
                  />
                </div>
                <div className="card-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <span className="event-category">{event.category}</span>
                    <span className="event-participants">
                      Max: {event.max_participants}
                    </span>
                    <span className="event-date">
                      {new Date(event.start_time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <button className="btn view-details">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default EventsPage;
