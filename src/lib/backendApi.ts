import { CapacitorHttp as Http } from '@capacitor/core'

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
 * const eventData: EventData = { ... };
 * const locationData: LocationData = { ... };
 * const event = await client.createEventWithLocation(eventData, locationData);
 * console.log("Event created:", event);
 */

// =====================
// Interfaces & Types
// =====================

export interface UserData {
  username: string;
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_picture?: string;
}

export interface UserResponse {
  user_id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_picture?: string;
}

export interface LocationData {
  location_id?: number; // Returned by the backend after creation
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface LocationResponse extends LocationData {}

export interface EventData {
  event_id?: number; // Returned by the backend after creation
  host_id: number;
  location_id?: number; // Will be set after creating/finding a location
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
}

export interface EventResponse extends EventData {}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
}

export interface ErrorResponse {
  detail: string;
}

// Admin: Roles & Permissions
export interface RoleData {
  role_name: string;
  description?: string;
}

export interface RoleResponse {
  role_id: number;
  role_name: string;
  description?: string;
}

export interface PermissionData {
  permission_name: string;
  description?: string;
}

export interface PermissionResponse {
  permission_id: number;
  permission_name: string;
  description?: string;
}

// Category type
export type CategoryResponse = {
  category: string;
}

// =====================
// ApiClient Class
// =====================

class ApiClient {
  private baseUrl: string;
  public token: string | null = localStorage.getItem("authToken") ?? null;

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
    const finalHeaders: Record<string, string> = { "Content-Type": "application/json", ...headers };

    if (this.token && !finalHeaders["Authorization"]) {
      finalHeaders["Authorization"] = `Bearer ${this.token}`;
      console.log('Using Auth header', finalHeaders);
    }

    if (data instanceof FormData) {
      delete finalHeaders["Content-Type"];
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
        options.data = data;
      }
    }

    const response = await Http.request(options);
    if (response.status < 200 || response.status >= 300) {
      const errorDetail =
        (response.data && (response.data.detail || response.data)) || response.status;
      throw new Error(`Error ${response.status}: ${errorDetail}`);
    }
    return response.data as T;
  }

  // -----------------------
  // Authentication Endpoints
  // -----------------------

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
    if (loginResponse.access_token) {
      this.token = loginResponse.access_token;
      localStorage.setItem("authToken", this.token);
    }
    return loginResponse;
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/api/v1/auth/me", "GET");
  }

  // -----------------------
  // User Endpoints
  // -----------------------

  async createUser(userData: UserData): Promise<UserResponse> {
    return this.request<UserResponse>("/api/v1/user/create", "POST", userData);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.request<UserResponse[]>("/api/v1/user/all", "GET");
  }

  async getUser(userId: number): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/v1/user/${userId}`, "GET");
  }

  async updateUser(userId: number, userData: Partial<UserData>): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/v1/user/${userId}`, "PUT", userData);
  }

  async deleteUser(userId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/api/v1/user/${userId}`, "DELETE");
  }

  async uploadProfilePicture(file: File): Promise<UserResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<UserResponse>("/api/v1/user/upload-profile-picture", "POST", formData);
  }

  // -----------------------
  // Admin Endpoints (Roles)
  // -----------------------

  async createRole(roleData: RoleData): Promise<RoleResponse> {
    return this.request<RoleResponse>("/api/v1/admin/roles", "POST", roleData);
  }

  async getAllRoles(): Promise<RoleResponse[]> {
    return this.request<RoleResponse[]>("/api/v1/admin/roles", "GET");
  }

  async getRole(roleId: number): Promise<RoleResponse> {
    return this.request<RoleResponse>(`/api/v1/admin/roles/${roleId}`, "GET");
  }

  async updateRole(roleId: number, roleData: RoleData): Promise<RoleResponse> {
    return this.request<RoleResponse>(`/api/v1/admin/roles/${roleId}`, "PUT", roleData);
  }

  async deleteRole(roleId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/api/v1/admin/roles/${roleId}`, "DELETE");
  }

  // -----------------------
  // Admin Endpoints (Permissions)
  // -----------------------

  async createPermission(permissionData: PermissionData): Promise<PermissionResponse> {
    return this.request<PermissionResponse>("/api/v1/admin/permissions", "POST", permissionData);
  }

  async getAllPermissions(): Promise<PermissionResponse[]> {
    return this.request<PermissionResponse[]>("/api/v1/admin/permissions", "GET");
  }

  async getPermission(permissionId: number): Promise<PermissionResponse> {
    return this.request<PermissionResponse>(`/api/v1/admin/permissions/${permissionId}`, "GET");
  }

  async updatePermission(permissionId: number, permissionData: PermissionData): Promise<PermissionResponse> {
    return this.request<PermissionResponse>(`/api/v1/admin/permissions/${permissionId}`, "PUT", permissionData);
  }

  async deletePermission(permissionId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/api/v1/admin/permissions/${permissionId}`, "DELETE");
  }

  // -----------------------
  // Location Endpoints
  // -----------------------

  async createLocation(locationData: LocationData): Promise<LocationResponse> {
    return this.request<LocationResponse>("/api/v1/locations/", "POST", locationData);
  }

  async getLocations(): Promise<LocationResponse[]> {
    return this.request<LocationResponse[]>("/api/v1/locations/", "GET");
  }

  async getLocation(locationId: number): Promise<LocationResponse> {
    return this.request<LocationResponse>(`/api/v1/locations/${locationId}`, "GET");
  }

  async updateLocation(locationId: number, locationData: LocationData): Promise<LocationResponse> {
    return this.request<LocationResponse>(`/api/v1/locations/${locationId}`, "PUT", locationData);
  }

  async deleteLocation(locationId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/api/v1/locations/${locationId}`, "DELETE");
  }

  /**
   * Helper to find a location by name.
   */
  async findLocationByName(name: string): Promise<LocationResponse | undefined> {
    const locations = await this.getLocations();
    return locations.find(loc => loc.name.toLowerCase() === name.toLowerCase());
  }

  // -----------------------
  // Event Endpoints
  // -----------------------

  async createEvent(eventData: EventData): Promise<EventResponse> {
    return this.request<EventResponse>("/api/v1/events/create", "POST", eventData);
  }

  async getEvents(): Promise<EventResponse[]> {
    return this.request<EventResponse[]>("/api/v1/events/", "GET");
  }

  async getEvent(eventId: number): Promise<EventResponse> {
    return this.request<EventResponse>(`/api/v1/events/${eventId}`, "GET");
  }

  async updateEvent(eventId: number, eventData: Partial<EventData>): Promise<EventResponse> {
    return this.request<EventResponse>(`/api/v1/events/${eventId}`, "PUT", eventData);
  }

  async deleteEvent(eventId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/api/v1/events/${eventId}`, "DELETE");
  }

  async joinEvent(eventId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/api/v1/events/${eventId}/join`, "POST");
  }

  async leaveEvent(eventId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/api/v1/events/${eventId}/leave`, "POST");
  }

  async getEventCategories(): Promise<CategoryResponse[]> {
    const categories = await this.request<string[]>("/api/v1/events/categories/all", "GET");
    return categories.map(category => ({ category }));
  }

  async getEventsByCategory(category: string): Promise<EventResponse[]> {
    return this.request<EventResponse[]>(`/api/v1/events/category/${category}`, "GET");
  }

  /**
   * Create an event with an associated location.
   * If the location does not exist, it is created first.
   */
  async createEventWithLocation(
    eventData: EventData,
    locationData: LocationData
  ): Promise<EventResponse> {
    let location = await this.findLocationByName(locationData.name);
    if (!location) {
      location = await this.createLocation(locationData);
    }
    eventData.location_id = location.location_id;
    return this.createEvent(eventData);
  }
}

export default ApiClient;
