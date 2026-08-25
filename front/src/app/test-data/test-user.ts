import { User } from '@app/core/models/user.interface';

export const TEST_USER: User = {
    id: 1,
    email: 'john.doe@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
};

export const TEST_USER_ADMIN = {
    id: 1,
    email: 'john.doe@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: true,
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
};