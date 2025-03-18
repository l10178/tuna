export interface User {
    id: string;
    name: string;
    email?: string;
    displayName?: string;
}

// current user
export const currentUser: User = {
    id: 'user1',
    name: 'User One',
    email: 'user1@example.com'
};

export const getUsers = (): User[] => [
    { id: 'user1', name: 'User One', email: 'user1@example.com' },
    { id: 'user2', name: 'User Two', email: 'user2@example.com' },
];

export const getUserById = (userId: string): User | undefined => {
    return getUsers().find(user => user.id === userId);
}; 