import { useEffect, useState } from "react";
import BackendApiClient from "../lib/BackendApiClient";
import { EventResponse, CategoryResponse } from "../lib/backendApi";
import "./events.css";

// Define a simple skeleton component for events
const EventSkeleton = () => (
  <div className="event-card skeleton">
    <div className="card-image skeleton-image"></div>
    <div className="card-content">
      <h3 className="event-title skeleton-title"></h3>
      <div className="event-meta">
        <span className="event-category skeleton-text"></span>
        <span className="event-participants skeleton-text"></span>
        <span className="event-date skeleton-text"></span>
      </div>
      <p className="event-description skeleton-text"></p>
      <div className="btn view-details skeleton-button"></div>
    </div>
  </div>
);

// Define a simple skeleton component for categories
const CategorySkeleton = () => <button className="category-chip skeleton-chip"></button>;

function EventsPage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchEventsAndCategories = async () => {
      setLoading(true); // Set loading to true before fetching

      try {
        const eventsResponse = await BackendApiClient.getEvents();
        setEvents(eventsResponse);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Optionally set events to an empty array or handle the error state
      }

      try {
        const categoriesResponse = await BackendApiClient.getEventCategories();
        setCategories(categoriesResponse);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Optionally set categories to an empty array or handle the error state
      } finally {
        setLoading(false); // Set loading to false after both fetches complete (or fail)
      }
    };

    fetchEventsAndCategories();
  }, []);

  // Update filtered events when events or search query change
  useEffect(() => {
    if (!loading) {
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
    } else {
      setFilteredEvents([]); // Clear filtered events while loading
    }
  }, [searchQuery, events, loading]);

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
      <section className="event-categories">
        <h2>Categories</h2>
        <div className="categories-list">
          {loading ? (
            // Show a few category skeletons while loading
            Array.from({ length: 3 }).map((_, index) => (
              <CategorySkeleton key={`skeleton-category-${index}`} />
            ))
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <button className="category-chip" key={index}>
                {category.category}
              </button>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </section>

      {/* Trending Events */}
      <section className="trending-events">
        <h2>Trending Events</h2>
        <div className="events-grid">
          {loading ? (
            // Show a few event skeletons while loading
            Array.from({ length: 3 }).map((_, index) => (
              <EventSkeleton key={`skeleton-event-${index}`} />
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
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
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default EventsPage;