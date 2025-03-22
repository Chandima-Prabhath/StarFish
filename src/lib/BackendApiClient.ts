import ApiClient from "./backendApi";
import { BACKEND_HOST } from "./config";

const BackendApiClient = new ApiClient(BACKEND_HOST);

export default BackendApiClient;