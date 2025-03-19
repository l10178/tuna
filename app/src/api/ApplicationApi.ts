export interface Application {
  id: string;
  name: string;
  description?: string;
  creator?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getApplications = (): Application[] => [
  { id: '1', name: '吃什么', creator: 'user1', category: '主食' },
  { id: '2', name: '吃什么Pro', creator: 'user1', category: '甜点' },
  { id: '3', name: '吃什么Lite', creator: 'user2', category: '早餐' },
];

export const getApplicationsByUserId = (userId: string): Application[] => {
  return getApplications().filter(app => app.creator === userId);
};

export const getCurrentUserApplications = (): Application[] => {
  // In a real app, this would get applications for the currently logged in user
  // For now, just return all applications
  return getApplications();
};
