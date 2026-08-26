import { Session } from "@app/core/models/session.interface";

export const TEST_SESSION: Session = {
    id: 1,
    name: 'Session de yoga débutant',
    description: 'Une session de yoga pour débutants',
    date: new Date('2026-09-15T18:00:00'),
    teacher_id: 10,
    users: [1, 2, 3],
    createdAt: new Date('2026-08-01T10:00:00'),
    updatedAt: new Date('2026-08-10T14:30:00'),
};

export const TEST_SESSION_NOT_PARTICIPATE: Session = {
    id: 1,
    name: 'Session de yoga débutant',
    description: 'Une session de yoga pour débutants',
    date: new Date('2026-09-15T18:00:00'),
    teacher_id: 10,
    users: [12, 13, 14],
    createdAt: new Date('2026-08-01T10:00:00'),
    updatedAt: new Date('2026-08-10T14:30:00'),
};

export const TEST_SESSIONS: Session[] = [
    TEST_SESSION,
    {
        id: 2,
        name: 'Yoga avancé',
        description: 'Session destinée aux pratiquants confirmés',
        date: new Date('2026-09-16T19:00:00'),
        teacher_id: 11,
        users: [2, 4],
        createdAt: new Date('2026-08-02T09:00:00'),
        updatedAt: new Date('2026-08-11T15:00:00'),
    },
    {
        id: 3,
        name: 'Yoga relaxation',
        description: 'Session axée sur la relaxation et la respiration',
        date: new Date('2026-09-17T17:30:00'),
        teacher_id: 10,
        users: [],
        createdAt: new Date('2026-08-03T11:00:00'),
        updatedAt: new Date('2026-08-12T16:00:00'),
    },
];