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

/**
 * 创建新应用
 */
export async function createApplication(application: Partial<Application>): Promise<Application> {
  const currentUser = await getCurrentUser();
  const appData = {
    ...application,
    createdBy: currentUser.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!isBackendAvailable()) {
    return createLocalApplication(appData as Application);
  }

  return await createApplicationByApi(appData as Application);
}

/**
 * 通过API创建应用
 */
async function createApplicationByApi(application: Application): Promise<Application> {
  try {
    const apiUrl = getBackendApiUrl();
    const response = await fetch(`${apiUrl}${APPLICATION_API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(application),
    });

    if (!response.ok) {
      throw new Error(`Failed to create application: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating application:', error);
    // 失败时回退到本地创建
    return createLocalApplication(application);
  }
}

/**
 * 在本地创建应用
 */
function createLocalApplication(application: Application): Application {
  try {
    // 获取现有应用列表
    const apps = getLocalApplications();

    // 创建一个新应用，生成唯一ID
    const newApp: Application = {
      ...application,
      id: `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    // 将新应用添加到列表中
    const updatedApps = [newApp, ...apps];

    // 保存到本地存储
    localStorage.setItem(LOCAL_STORAGE_APPS, JSON.stringify(updatedApps));

    return newApp;
  } catch (error) {
    console.error('Error creating application in localStorage:', error);
    throw new Error('Failed to create application locally');
  }
}

/**
 * 删除应用
 */
export async function deleteApplication(applicationId: string): Promise<boolean> {
  if (!isBackendAvailable()) {
    return deleteLocalApplication(applicationId);
  }
  return await deleteApplicationByApi(applicationId);
}

/**
 * 通过API删除应用
 */
async function deleteApplicationByApi(applicationId: string): Promise<boolean> {
  try {
    const apiUrl = getBackendApiUrl();
    const response = await fetch(`${apiUrl}${APPLICATION_API_BASE_URL}/${applicationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete application: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    // 失败时回退到本地删除
    return deleteLocalApplication(applicationId);
  }
}

/**
 * 在本地删除应用
 */
function deleteLocalApplication(applicationId: string): boolean {
  try {
    // 获取现有应用列表
    const apps = getLocalApplications();

    // 过滤掉要删除的应用
    const updatedApps = apps.filter(app => app.id !== applicationId);

    // 如果长度相同，则表示没有找到要删除的应用
    if (updatedApps.length === apps.length) {
      return false;
    }

    // 保存到本地存储
    localStorage.setItem(LOCAL_STORAGE_APPS, JSON.stringify(updatedApps));

    return true;
  } catch (error) {
    console.error('Error deleting application from localStorage:', error);
    return false;
  }
}

/**
 * 获取应用详情
 */
export async function getApplicationById(applicationId: string): Promise<Application> {
  if (!isBackendAvailable()) {
    return getLocalApplicationById(applicationId);
  }
  return await getApplicationByApi(applicationId);
}

/**
 * 通过API获取应用详情
 */
async function getApplicationByApi(applicationId: string): Promise<Application> {
  try {
    const apiUrl = getBackendApiUrl();
    const response = await fetch(`${apiUrl}${APPLICATION_API_BASE_URL}/${applicationId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch application: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching application:', error);
    // 失败时回退到本地获取
    return getLocalApplicationById(applicationId);
  }
}

/**
 * 从本地获取应用详情
 */
function getLocalApplicationById(applicationId: string): Application {
  const apps = getLocalApplications();
  const app = apps.find(app => app.id === applicationId);
  if (!app) {
    throw new Error(`Application not found: ${applicationId}`);
  }
  return app;
}

/**
 * 更新应用
 */
export async function updateApplication(application: Application): Promise<Application> {
  if (!isBackendAvailable()) {
    return updateLocalApplication(application);
  }
  return await updateApplicationByApi(application);
}

/**
 * 通过API更新应用
 */
async function updateApplicationByApi(application: Application): Promise<Application> {
  try {
    const apiUrl = getBackendApiUrl();
    const response = await fetch(`${apiUrl}${APPLICATION_API_BASE_URL}/${application.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...application,
        updatedAt: new Date()
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update application: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating application:', error);
    // 失败时回退到本地更新
    return updateLocalApplication(application);
  }
}

/**
 * 在本地更新应用
 */
function updateLocalApplication(application: Application): Application {
  try {
    // 获取现有应用列表
    const apps = getLocalApplications();

    // 查找要更新的应用索引
    const appIndex = apps.findIndex(app => app.id === application.id);
    if (appIndex === -1) {
      throw new Error(`Application not found: ${application.id}`);
    }

    // 更新应用
    const updatedApp = {
      ...application,
      updatedAt: new Date()
    };

    // 更新应用列表
    const updatedApps = [...apps];
    updatedApps[appIndex] = updatedApp;

    // 保存到本地存储
    localStorage.setItem(LOCAL_STORAGE_APPS, JSON.stringify(updatedApps));

    return updatedApp;
  } catch (error) {
    console.error('Error updating application in localStorage:', error);
    throw new Error('Failed to update application locally');
  }
}

/**
 * 获取应用的数据集
 */
export async function getApplicationDataset(applicationId: string): Promise<any[]> {
  if (!isBackendAvailable()) {
    return getLocalApplicationDataset(applicationId);
  }
  return await getApplicationDatasetByApi(applicationId);
}

/**
 * 通过API获取应用数据集
 */
async function getApplicationDatasetByApi(applicationId: string): Promise<any[]> {
  try {
    const apiUrl = getBackendApiUrl();
    const url = `${apiUrl}${APPLICATION_API_BASE_URL}/${applicationId}/dataset`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch application dataset: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching application dataset:', error);
    // 失败时回退到本地获取
    return getLocalApplicationDataset(applicationId);
  }
}

/**
 * 从本地获取应用数据集（模拟）
 */
function getLocalApplicationDataset(applicationId: string): any[] {
  try {
    // 获取应用信息
    const app = getLocalApplicationById(applicationId);

    // 创建一些模拟数据项
    return generateMockDataItems(app, 10);
  } catch (error) {
    console.error('Error getting local application dataset:', error);
    return [];
  }
}

/**
 * 生成模拟数据项
 */
function generateMockDataItems(app: Application, count: number): any[] {
  const items: any[] = [];
  const tags = app.tags || [];

  for (let i = 0; i < count; i++) {
    // 为每个数据项随机分配1-3个应用标签
    const itemTags = tags.length > 0
      ? shuffleArray([...tags]).slice(0, Math.min(Math.floor(Math.random() * 3) + 1, tags.length))
      : [];

    items.push({
      id: `data_${app.id}_${i}`,
      name: `${app.name} 数据 ${i + 1}`,
      description: `这是应用 "${app.name}" 的数据项 ${i + 1}`,
      category: app.name,
      tags: itemTags,
      createdAt: new Date().toISOString(),
      applicationId: app.id
    });
  }

  return items;
}

/**
 * 打乱数组顺序（Fisher-Yates 洗牌算法）
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
