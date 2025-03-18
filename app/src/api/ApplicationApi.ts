export interface Application {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
// get current user applications
export const getCurrentUserApplications = (): Application[] => [
  { id: 'app-anonymous1', name: '吃什么', createdBy: 'anonymous' },
  { id: 'app-anonymous2', name: '吃什么Pro', createdBy: 'anonymous' },
  { id: 'app-anonymous3', name: '吃什么Lite', createdBy: 'anonymous' },
];
