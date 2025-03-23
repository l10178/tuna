import { getBackendApiUrl, isBackendAvailable } from '../utils/config';
import { Application, LOCAL_STORAGE_APPS, LOCAL_STORAGE_DATASET_PREFIX } from './Modules';
import { getCurrentUser } from './UserApi';
import { defaultApplications } from './MockApi';
import {
  getDatasetItems,
  addDatasetItem as addItemToDataset,
  updateDatasetItem as updateItemInDataset,
  deleteDatasetItem as deleteItemFromDataset,
  createDataset
} from './DatasetApi';

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

  try {
    // 首先创建一个空的数据集
    const dataset = await createDataset({
      name: `${application.name || '新应用'} 数据集`,
      description: `${application.name || '新应用'} 的数据集`,
      tags: application.tags || [],
      datas: []
    });

    // 将数据集ID关联到应用
    appData.datasetId = dataset.id;

    // 创建带有数据集ID的应用
    if (!isBackendAvailable()) {
      return createLocalApplication(appData as Application);
    }

    return await createApplicationByApi(appData as Application);
  } catch (error) {
    console.error('Error creating dataset for application:', error);
    // 如果创建数据集失败，仍然继续创建应用，但没有关联数据集
    if (!isBackendAvailable()) {
      return createLocalApplication(appData as Application);
    }
    return await createApplicationByApi(appData as Application);
  }
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(application)
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
      id: `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`
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
      method: 'DELETE'
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...application,
        updatedAt: new Date()
      })
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
 * @deprecated 请使用DatasetApi模块的getDatasetItems函数
 */
export async function getApplicationDataset(applicationId: string): Promise<any[]> {
  try {
    // 获取应用信息
    const app = await getApplicationById(applicationId);

    // 如果应用有关联的数据集ID，使用DatasetApi获取数据项
    if (app.datasetId) {
      return await getDatasetItems(app.datasetId);
    }

    // 如果应用没有关联数据集ID，回退到原本的逻辑
    if (!isBackendAvailable()) {
      return getLocalApplicationDataset(applicationId);
    }
    return await getApplicationDatasetByApi(applicationId);
  } catch (error) {
    console.error('Error in getApplicationDataset:', error);
    // 出错时回退到原有逻辑
    if (!isBackendAvailable()) {
      return getLocalApplicationDataset(applicationId);
    }
    return await getApplicationDatasetByApi(applicationId);
  }
}

/**
 * 通过API获取应用数据集
 * @deprecated 请使用DatasetApi模块
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
    // 首先尝试从本地存储中获取数据集
    const storageKey = `${LOCAL_STORAGE_DATASET_PREFIX}${applicationId}`;
    const storedDatasets = localStorage.getItem(storageKey);

    if (storedDatasets) {
      const datasets = JSON.parse(storedDatasets);
      if (datasets && datasets.length > 0) {
        return datasets;
      }
    }

    // 如果本地存储中没有数据，获取应用信息并创建模拟数据
    const app = getLocalApplicationById(applicationId);
    const mockDataItems = generateMockDataItems(app, 10);

    // 将生成的模拟数据保存到本地存储，以便下次使用
    localStorage.setItem(storageKey, JSON.stringify(mockDataItems));

    return mockDataItems;
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
    const itemTags =
      tags.length > 0
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

/**
 * 添加数据集项
 * @deprecated 请使用DatasetApi模块的addDatasetItem函数
 */
export async function addDatasetItem(applicationId: string, item: any): Promise<any> {
  try {
    // 获取应用信息
    const app = await getApplicationById(applicationId);

    // 如果应用有关联的数据集ID，使用DatasetApi添加数据项
    if (app.datasetId) {
      return await addItemToDataset(app.datasetId, item);
    }

    // 如果应用没有关联数据集ID，回退到原本的逻辑
    if (!isBackendAvailable()) {
      return addLocalDatasetItem(applicationId, item);
    }
    return await addDatasetItemByApi(applicationId, item);
  } catch (error) {
    console.error('Error in addDatasetItem:', error);
    // 出错时回退到原有逻辑
    if (!isBackendAvailable()) {
      return addLocalDatasetItem(applicationId, item);
    }
    return await addDatasetItemByApi(applicationId, item);
  }
}

/**
 * 通过API添加数据集项
 */
async function addDatasetItemByApi(applicationId: string, item: any): Promise<any> {
  try {
    const apiUrl = getBackendApiUrl();
    const url = `${apiUrl}${APPLICATION_API_BASE_URL}/${applicationId}/dataset`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...item,
        applicationId,
        createdAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add dataset item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding dataset item:', error);
    // 失败时回退到本地添加
    return addLocalDatasetItem(applicationId, item);
  }
}

/**
 * 在本地添加数据集项
 */
function addLocalDatasetItem(applicationId: string, item: any): any {
  try {
    // 获取本地存储的应用数据集
    const storageKey = `${LOCAL_STORAGE_DATASET_PREFIX}${applicationId}`;
    let datasets: any[] = [];

    const storedDatasets = localStorage.getItem(storageKey);
    if (storedDatasets) {
      datasets = JSON.parse(storedDatasets);
    }

    // 创建新的数据集项
    const newItem = {
      ...item,
      id: `data_${applicationId}_${Date.now()}`,
      applicationId,
      createdAt: new Date().toISOString()
    };

    // 添加到数据集
    datasets.push(newItem);

    // 保存到本地存储
    localStorage.setItem(storageKey, JSON.stringify(datasets));

    return newItem;
  } catch (error) {
    console.error('Error adding dataset item to localStorage:', error);
    throw new Error('Failed to add dataset item locally');
  }
}

/**
 * 更新数据集项
 * @deprecated 请使用DatasetApi模块的updateDatasetItem函数
 */
export async function updateDatasetItem(applicationId: string, item: any): Promise<any> {
  try {
    // 获取应用信息
    const app = await getApplicationById(applicationId);

    // 如果应用有关联的数据集ID，使用DatasetApi更新数据项
    if (app.datasetId) {
      return await updateItemInDataset(app.datasetId, item.id, item);
    }

    // 如果应用没有关联数据集ID，回退到原本的逻辑
    if (!isBackendAvailable()) {
      return updateLocalDatasetItem(applicationId, item);
    }
    return await updateDatasetItemByApi(applicationId, item);
  } catch (error) {
    console.error('Error in updateDatasetItem:', error);
    // 出错时回退到原有逻辑
    if (!isBackendAvailable()) {
      return updateLocalDatasetItem(applicationId, item);
    }
    return await updateDatasetItemByApi(applicationId, item);
  }
}

/**
 * 通过API更新数据集项
 */
async function updateDatasetItemByApi(applicationId: string, item: any): Promise<any> {
  try {
    const apiUrl = getBackendApiUrl();
    const url = `${apiUrl}${APPLICATION_API_BASE_URL}/${applicationId}/dataset/${item.id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...item,
        updatedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update dataset item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating dataset item:', error);
    // 失败时回退到本地更新
    return updateLocalDatasetItem(applicationId, item);
  }
}

/**
 * 在本地更新数据集项
 */
function updateLocalDatasetItem(applicationId: string, item: any): any {
  try {
    // 获取本地存储的应用数据集
    const storageKey = `${LOCAL_STORAGE_DATASET_PREFIX}${applicationId}`;
    let datasets: any[] = [];

    const storedDatasets = localStorage.getItem(storageKey);
    if (storedDatasets) {
      datasets = JSON.parse(storedDatasets);
    }

    // 查找要更新的数据项索引
    const itemIndex = datasets.findIndex(dataItem => dataItem.id === item.id);
    if (itemIndex === -1) {
      throw new Error(`Dataset item not found: ${item.id}`);
    }

    // 更新数据项
    const updatedItem = {
      ...item,
      updatedAt: new Date().toISOString()
    };

    // 更新数据集
    datasets[itemIndex] = updatedItem;

    // 保存到本地存储
    localStorage.setItem(storageKey, JSON.stringify(datasets));

    return updatedItem;
  } catch (error) {
    console.error('Error updating dataset item in localStorage:', error);
    throw new Error('Failed to update dataset item locally');
  }
}

/**
 * 删除数据集项
 * @deprecated 请使用DatasetApi模块的deleteDatasetItem函数
 */
export async function deleteDatasetItem(applicationId: string, itemId: string): Promise<boolean> {
  try {
    // 获取应用信息
    const app = await getApplicationById(applicationId);

    // 如果应用有关联的数据集ID，使用DatasetApi删除数据项
    if (app.datasetId) {
      return await deleteItemFromDataset(app.datasetId, itemId);
    }

    // 如果应用没有关联数据集ID，回退到原本的逻辑
    if (!isBackendAvailable()) {
      return deleteLocalDatasetItem(applicationId, itemId);
    }
    return await deleteDatasetItemByApi(applicationId, itemId);
  } catch (error) {
    console.error('Error in deleteDatasetItem:', error);
    // 出错时回退到原有逻辑
    if (!isBackendAvailable()) {
      return deleteLocalDatasetItem(applicationId, itemId);
    }
    return await deleteDatasetItemByApi(applicationId, itemId);
  }
}

/**
 * 通过API删除数据集项
 */
async function deleteDatasetItemByApi(applicationId: string, itemId: string): Promise<boolean> {
  try {
    const apiUrl = getBackendApiUrl();
    const url = `${apiUrl}${APPLICATION_API_BASE_URL}/${applicationId}/dataset/${itemId}`;

    const response = await fetch(url, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete dataset item: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting dataset item:', error);
    // 失败时回退到本地删除
    return deleteLocalDatasetItem(applicationId, itemId);
  }
}

/**
 * 在本地删除数据集项
 */
function deleteLocalDatasetItem(applicationId: string, itemId: string): boolean {
  try {
    // 获取本地存储的应用数据集
    const storageKey = `${LOCAL_STORAGE_DATASET_PREFIX}${applicationId}`;
    let datasets: any[] = [];

    const storedDatasets = localStorage.getItem(storageKey);
    if (storedDatasets) {
      datasets = JSON.parse(storedDatasets);
    }

    // 过滤掉要删除的数据项
    const filteredDatasets = datasets.filter(item => item.id !== itemId);

    // 如果长度相同，则表示没有找到要删除的数据项
    if (filteredDatasets.length === datasets.length) {
      return false;
    }

    // 保存到本地存储
    localStorage.setItem(storageKey, JSON.stringify(filteredDatasets));

    return true;
  } catch (error) {
    console.error('Error deleting dataset item from localStorage:', error);
    return false;
  }
}
