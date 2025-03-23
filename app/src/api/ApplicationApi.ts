import { getBackendApiUrl, isBackendAvailable } from '../utils/config';
import { Application, LOCAL_STORAGE_APPS } from './Modules';
import { getCurrentUser } from './UserApi';
import { defaultApplications } from './MockApi';

const APPLICATION_API_BASE_URL = '/api/applications';

/**
 * 获取当前用户的应用列表
 */
export async function getCurrentUserApplications(): Promise<Application[]> {
  // 获取当前用户的应用列表
  const currentUser = await getCurrentUser();
  return getApplicationsByUserId(currentUser.id);
}

/**
 * 根据用户ID获取应用列表
 */
async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  if (!isBackendAvailable()) {
    return getLocalApplications();
  }
  return await getApplicationsByApi(userId);
}

async function getApplicationsByApi(userId: string): Promise<Application[]> {
  try {
    const apiUrl = getBackendApiUrl();
    const response = await fetch(`${apiUrl}${APPLICATION_API_BASE_URL}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch applications: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

function getLocalApplications(): Application[] {
  try {
    const storedApps = localStorage.getItem(LOCAL_STORAGE_APPS);
    if (storedApps) {
      return JSON.parse(storedApps);
    }
    // 如果本地没有存储，设置默认数据并保存
    localStorage.setItem(LOCAL_STORAGE_APPS, JSON.stringify(defaultApplications));
    return defaultApplications;
  } catch (error) {
    console.error('Error reading applications from localStorage:', error);
    return defaultApplications;
  }
}
