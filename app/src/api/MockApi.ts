import { ANONYMOUS_USER_ID, Application } from "./Modules";

// 默认应用列表，当没有本地存储数据时使用
export const defaultApplications: Application[] = [
    { id: '1', name: '吃什么', description: '吃什么是一款基于AI的智能推荐应用，可以根据用户的口味和偏好推荐美食。', createdBy: ANONYMOUS_USER_ID },
    { id: '2', name: '吃什么Pro', description: '吃什么Pro是一款基于AI的智能推荐应用，可以根据用户的口味和偏好推荐美食。', createdBy: ANONYMOUS_USER_ID },
    { id: '3', name: '吃什么Lite', description: '吃什么Lite是一款基于AI的智能推荐应用，可以根据用户的口味和偏好推荐美食。', createdBy: ANONYMOUS_USER_ID },
];
