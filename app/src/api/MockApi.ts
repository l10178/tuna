import { ANONYMOUS_USER_ID, Application } from "./Modules";

// 默认应用列表，当没有本地存储数据时使用
export const defaultApplications: Application[] = [
    { id: '1', name: '吃什么', createdBy: ANONYMOUS_USER_ID },
    { id: '2', name: '吃什么Pro', createdBy: ANONYMOUS_USER_ID },
    { id: '3', name: '吃什么Lite', createdBy: ANONYMOUS_USER_ID },
];
