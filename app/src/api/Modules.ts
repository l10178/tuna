

export interface User {
    id: string;
    name: string;
    email?: string;
    displayName?: string;
    isAnonymous?: boolean;
}

export interface Application {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    tags?: string[];
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * 匿名用户ID
 */
export const ANONYMOUS_USER_ID = 'anonymous';

/**
 * 本地存储前缀
 */

export const LOCAL_STORAGE_PREFIX = 'tuna_';

/**
 * 本地存储应用列表键名
 */
export const LOCAL_STORAGE_APPS = `${LOCAL_STORAGE_PREFIX}apps`;

/**
 * 未登录时全部使用本匿名用户，数据基于匿名用户存储到本地
 */
export const ANONYMOUS_USER: User = {
    id: ANONYMOUS_USER_ID,
    name: 'Guest',
    displayName: 'Guest',
    isAnonymous: true
};