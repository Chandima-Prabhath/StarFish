import { CapacitorHttp as Http } from '@capacitor/core';

/**
 * API Client for FastAPI backend.
 *
 * This client abstracts the endpoints defined in your backend.
 * It uses the Capacitor HTTP plugin for network requests.
 *
 * Example usage:
 * const client = new ApiClient("http://localhost:8000");
 * await client.login("username", "password");
 *
 * // Create a new event with a location:
 * const eventData: EventData = {
 *   host_id: 1,
 *   title: "My Awesome Event",
 *   start_time: "2025-03-22 06:29:49",
 *   end_time: "2025-03-22 08:29:49",
 *   description: "An event description",
 *   category: "party",
 *   max_participants: 100,
 *   event_picture: "https://example.com/image.jpg",
 *   is_recurring: false,
 *   recurrence_type: "",
 *   recurrence_interval: 0,
 *   recurrence_end_date: "2025-03-22 06:29:49",
 *   custom_recurrence_pattern: ""
 * };
 *
 * const locationData: LocationData = {
 *   name: "Cool Venue",
 *   address: "123 Main St",
 *   city: "Metropolis",
 *   state: "State",
 *   country: "Country",
 *   latitude: 40.7128,
 *   longitude: -74.0060
 * };
 *
 * const event = await client.createEventWithLocation(eventData, locationData);
 * console.log("Event created:", event);
 */

interface UserData {
  username: string;
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_picture?: string;
}

interface LocationData {
  location_id?: number; // May be returned by the backend
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface EventData {
  event_id?: number; // May be returned by the backend
  host_id: number;
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  category: string;
  max_participants: number;
  event_picture?: string;
  is_recurring: boolean;
  recurrence_type?: string;
  recurrence_interval?: number;
  recurrence_end_date?: string;
  custom_recurrence_pattern?: string;
  location_id?: number; // Will be set before creating the event
}

interface LoginResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
}

interface UserResponse {
  user_id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_picture?: string;
}

interface LocationResponse extends LocationData {}

interface EventResponse extends EventData {}

interface ErrorResponse {
  detail: string;
}

class ApiClient {
  private baseUrl: string;
  public token: string | null = localStorage.getItem("authToken") ?? null; // Store the JWT token
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Helper to perform HTTP requests using Capacitor Http.
   */
  private async request<T>(
    path: string,
    method: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    // Set default header for JSON if not already provided.
    const finalHeaders: Record<string, string> = { "Content-Type": "application/json", ...headers };

    // If a token is stored and Authorization is not already provided, add it.
    if (this.token && !finalHeaders["Authorization"]) {
      finalHeaders["Authorization"] = `Bearer ${this.token}`;
      console.log('Using Auth header',finalHeaders);
    }

    const options: any = {
      url,
      method,
      headers: finalHeaders,
    };

    if (data) {
      if (finalHeaders["Content-Type"] === "application/json") {
        options.data = data;
      } else {
        // For other content types, such as form URL encoded, send as string.
        options.data = data;
      }
    }

    const response = await Http.request(options);
    if (response.status < 200 || response.status >= 300) {
      // Attempt to extract error details from response.data.
      const errorDetail =
        (response.data && (response.data.detail || response.data)) || response.status;
      throw new Error(`Error ${response.status}: ${errorDetail}`);
    }
    return response.data as T;
  }

  /**
   * Log in with username and password.
   * Stores the access token to be used in subsequent requests.
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const loginResponse = await this.request<LoginResponse>(
      "/api/v1/auth/login",
      "POST",
      formData.toString(),
      { "Content-Type": "application/x-www-form-urlencoded" }
    );
    // Save token if available
    if (loginResponse.access_token) {
      this.token = loginResponse.access_token;
      localStorage.setItem("authToken", this.token);
    }
    return loginResponse;
  }

  /**
   * Retrieve the currently logged-in user.
   */
  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/api/v1/auth/me", "GET");
  }

  /**
   * Create a new user.
   */
  async createUser(userData: UserData): Promise<UserResponse> {
    return this.request<UserResponse>("/api/v1/user/create", "POST", userData);
  }

  /**
   * Create a new location.
   */
  async createLocation(locationData: LocationData): Promise<LocationResponse> {
    return this.request<LocationResponse>("/api/v1/locations/", "POST", locationData);
  }

  /**
   * Retrieve all locations.
   */
  async getLocations(): Promise<LocationResponse[]> {
    return this.request<LocationResponse[]>("/api/v1/locations/", "GET");
  }

  /**
   * Find a location by name.
   */
  async findLocationByName(name: string): Promise<LocationResponse | undefined> {
    const locations = await this.getLocations();
    return locations.find(loc => loc.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Create a new event.
   */
  async createEvent(eventData: EventData): Promise<EventResponse> {
    return this.request<EventResponse>("/api/v1/events/create", "POST", eventData);
  }

  /**
   * Retrieve all events.
   */
  async getEvents(): Promise<EventResponse[]> {
    return this.request<EventResponse[]>("/api/v1/events/", "GET");
  }

  /**
   * Create an event with an associated location.
   * If the location does not exist, it is created first.
   */
  async createEventWithLocation(
    eventData: EventData,
    locationData: LocationData
  ): Promise<EventResponse> {
    // Try to find the location by name.
    let location = await this.findLocationByName(locationData.name);
    if (!location) {
      // Create the location if not found.
      location = await this.createLocation(locationData);
    }
    // Set the location_id for the event.
    eventData.location_id = location.location_id;
    // Create the event.
    return this.createEvent(eventData);
  }
}

export default ApiClient;
