import { ANONYMOUS_USER_ID, Application, Dataset } from "./Modules";

// 默认应用列表，当没有本地存储数据时使用
export const defaultApplications: Application[] = [
    {
        id: 'anonymous01',
        name: '吃什么',
        description: '吃什么是一款基于AI的智能推荐应用，可以根据用户的口味和偏好推荐美食。',
        createdBy: ANONYMOUS_USER_ID,
        datasetId: 'anonymousDataset01'
    },
    {
        id: 'anonymous02',
        name: '吃什么Pro',
        description: '吃什么Pro是一款基于AI的智能推荐应用，可以根据用户的口味和偏好推荐美食。',
        createdBy: ANONYMOUS_USER_ID,
        datasetId: 'anonymousDataset02'
    },
    {
        id: 'anonymous03',
        name: '吃什么Lite',
        description: '吃什么Lite是一款基于AI的智能推荐应用，可以根据用户的口味和偏好推荐美食。',
        createdBy: ANONYMOUS_USER_ID,
        datasetId: 'anonymousDataset03'
    },
];

export const anonymousDataset01: Dataset = {
    id: 'anonymousdataset01',
    name: '吃什么数据集',
    createdBy: ANONYMOUS_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: '吃什么数据集',
    datas: [
        {
            id: 'anonymous01',
            name: '吃什么数据集',
            description: '吃什么数据集',
            category: '美食',
            tags: ['美食', '推荐', 'AI'],
        }
    ],
};

export const anonymousDataset02: Dataset = {
    ...anonymousDataset01,
    id: 'anonymousdataset02',
};

export const anonymousDataset03: Dataset = {
    ...anonymousDataset01,
    id: 'anonymousdataset03',
};


export const defaultPrizeList = [
    { background: '#e9e8fe', fonts: [{ text: '麻婆豆腐', top: '10%' }] },
    { background: '#b8c5f2', fonts: [{ text: '回锅肉', top: '10%' }] },
    { background: '#e9e8fe', fonts: [{ text: '宫保鸡丁', top: '10%' }] },
    { background: '#b8c5f2', fonts: [{ text: '水煮鱼', top: '10%' }] },
    { background: '#e9e8fe', fonts: [{ text: '鱼香肉丝', top: '10%' }] },
    { background: '#b8c5f2', fonts: [{ text: '辣子鸡', top: '10%' }] }
];

// 结果显示用的石头剪刀布表情
export const resultEmojis = ['✊', '✋', '✌'];

/**
 * 获取随机表情
 * @returns 随机选择的表情
 */
export const createRandomEmoji = (): string => {
    return resultEmojis[Math.floor(Math.random() * resultEmojis.length)];
};