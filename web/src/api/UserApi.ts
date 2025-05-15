import { getBackendApiUrl, isBackendAvailable } from '../utils/config';
import { ANONYMOUS_USER, User } from './Modules';

// API URL常量
const USER_API_BASE_URL = '/api/users';

/**
 * 获取当前登录用户
 * @returns 当前用户，如果后端不可用则返回匿名用户
 */
export async function getCurrentUser(): Promise<User> {
  if (!isBackendAvailable()) {
    return ANONYMOUS_USER;
  }
  try {
    const apiUrl = getBackendApiUrl();
    const response = await fetch(`${apiUrl}${USER_API_BASE_URL}/current`);
    if (!response.ok) {
      throw new Error(`Failed to fetch current user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return ANONYMOUS_USER;
  }
}
