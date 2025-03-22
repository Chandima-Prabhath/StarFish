/**
 * API Client for FastAPI backend.
 *
 * This client abstracts the endpoints defined in your main.py.
 * It uses the Fetch API with credentials included (to handle HTTP-only cookies).
 *
 * Example usage:
 *   const client = new ApiClient("http://localhost:8000");
 *   await client.login("username", "password");
 *
 *   // Create a new event with a location:
 *   const eventData = {
 *     host_id: 1,
 *     title: "My Awesome Event",
 *     start_time: "2025-03-22 06:29:49",
 *     end_time: "2025-03-22 08:29:49",
 *     description: "An event description",
 *     category: "party",
 *     max_participants: 100,
 *     event_picture: "https://example.com/image.jpg",
 *     is_recurring: false,
 *     recurrence_type: "",
 *     recurrence_interval: 0,
 *     recurrence_end_date: "2025-03-22 06:29:49",
 *     custom_recurrence_pattern: ""
 *   };
 *
 *   const locationData = {
 *     name: "Cool Venue",
 *     address: "123 Main St",
 *     city: "Metropolis",
 *     state: "State",
 *     country: "Country",
 *     latitude: 40.7128,
 *     longitude: -74.0060
 *   };
 *
 *   const event = await client.createEventWithLocation(eventData, locationData);
 *   console.log("Event created:", event);
 */
class ApiClient {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    // Helper to perform fetch calls with credentials (for cookies)
    async request(path, options = {}) {
      const url = `${this.baseUrl}${path}`;
      const response = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      return response.json();
    }
  
    // Authentication methods
  
    /**
     * Log in with username and password.
     * Expects the server to set an HTTP-only cookie on success.
     */
    async login(username, password) {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          // For form data, use application/x-www-form-urlencoded
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Login failed: ${err}`);
      }
      return response.json();
    }
  
    /**
     * Retrieve the currently logged-in user.
     */
    async getCurrentUser() {
      return this.request("/api/v1/auth/me", { method: "GET" });
    }
  
    // User methods
  
    /**
     * Create a new user.
     */
    async createUser(userData) {
      return this.request("/api/v1/user/create", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    }
  
    // Location methods
  
    /**
     * Create a new location.
     */
    async createLocation(locationData) {
      return this.request("/api/v1/locations/", {
        method: "POST",
        body: JSON.stringify(locationData),
      });
    }
  
    /**
     * Retrieve all locations.
     * Optionally filter by a predicate (e.g., matching a name).
     */
    async getLocations() {
      return this.request("/api/v1/locations/", { method: "GET" });
    }
  
    /**
     * Find a location by name.
     * This example does a simple linear search over all locations.
     */
    async findLocationByName(name) {
      const locations = await this.getLocations();
      return locations.find(loc => loc.name.toLowerCase() === name.toLowerCase());
    }
  
    // Event methods
  
    /**
     * Create a new event.
     * Expects eventData to contain a valid location_id.
     */
    async createEvent(eventData) {
      return this.request("/api/v1/events/create", {
        method: "POST",
        body: JSON.stringify(eventData),
      });
    }
  
    /**
     * Retrieve all events.
     */
    async getEvents() {
      return this.request("/api/v1/events/", { method: "GET" });
    }
  
    /**
     * Create an event where the location might not exist.
     *
     * This helper checks if a location with the given name exists.
     * If not, it creates the location first and then creates the event.
     *
     * @param {Object} eventData - The event data. Must include host_id and title, etc.
     * @param {Object} locationData - The location data. Must include a name.
     * @returns The created event.
     */
    async createEventWithLocation(eventData, locationData) {
      // First, try to find the location by name.
      let location = await this.findLocationByName(locationData.name);
      if (!location) {
        // Create location if not found.
        location = await this.createLocation(locationData);
      }
      // Set the location_id in eventData.
      eventData.location_id = location.location_id;
      // Create the event.
      return this.createEvent(eventData);
    }
  }
  
export default ApiClient;