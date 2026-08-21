import { Teacher } from '@app/core/models/teacher.interface';

export const TEST_TEACHER: Teacher = {
    id: 1,
    lastName: 'Dupont',
    firstName: 'Jean',
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
};

export const TEST_TEACHERS: Teacher[] = [
    TEST_TEACHER,
    {
        id: 2,
        lastName: 'Martin',
        firstName: 'Sophie',
        createdAt: new Date('2025-02-10T09:30:00'),
        updatedAt: new Date('2025-02-10T09:30:00'),
    },
    {
        id: 3,
        lastName: 'Bernard',
        firstName: 'Thomas',
        createdAt: new Date('2025-03-05T14:15:00'),
        updatedAt: new Date('2025-03-05T14:15:00'),
    },
];