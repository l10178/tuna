/**
 * Configuration utilities for accessing environment variables
 */

/**
 * Gets the backend API URL from environment variables
 * @returns The backend API URL or null if not set
 */
export function getBackendApiUrl(): string | null {
    return process.env.REACT_APP_BACKEND_API_URL || null;
}

/**
 * Checks if the backend API is available
 * @returns true if the backend API URL is set
 */
export function isBackendAvailable(): boolean {
    return getBackendApiUrl() !== null;
}

