export interface Application {
  id: string;
  name: string;
  description?: string;
  creator?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getApplications = (): Application[] => [
  { id: '1', name: '吃什么', creator: 'user1' },
  { id: '2', name: '吃什么Pro', creator: 'user1' },
  { id: '3', name: '吃什么Lite', creator: 'user2' },
];

export const getApplicationsByUserId = (userId: string): Application[] => {
  return getApplications().filter(app => app.creator === userId);
};
