import { getBackendApiUrl, isBackendAvailable } from '../utils/config';

export interface User {
    id: string;
    name: string;
    email?: string;
    displayName?: string;
    isAnonymous?: boolean;
}

// Anonymous user for when no backend API is available
const anonymousUser: User = {
    id: 'anonymous',
    name: 'Guest',
    isAnonymous: true
};

export class UserApi {
    private static readonly baseUrl = '/api/users';

    /**
     * Gets the current logged in user
     * @returns The current user or anonymous user if backend is not available
     */
    static async getCurrentUser(): Promise<User> {
        if (!isBackendAvailable()) {
            return Promise.resolve(anonymousUser);
        }

        try {
            const apiUrl = getBackendApiUrl();
            const response = await fetch(`${apiUrl}${this.baseUrl}/current`);
            if (!response.ok) {
                throw new Error(`Failed to fetch current user: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching current user:', error);
            return anonymousUser;
        }
    }


}