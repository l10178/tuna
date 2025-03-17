export interface Application {
  id: string;
  name: string;
  description?: string;
  creator?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getApplications = (): Application[] => [
  { id: '1', name: '吃什么' },
  { id: '2', name: '吃什么Pro' },
  { id: '3', name: '吃什么Lite' },
];
