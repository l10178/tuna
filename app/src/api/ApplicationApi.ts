export interface Application {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getApplications = (): Application[] => [
  { id: '1', name: '吃什么', createdBy: 'user1' },
  { id: '2', name: '吃什么Pro', createdBy: 'user1' },
  { id: '3', name: '吃什么Lite', createdBy: 'user2' },
];

export const getApplicationsByUserId = (userId: string): Application[] => {
  return getApplications().filter(app => app.createdBy === userId);
};
