const baseUrl = 'http://localhost:8080/api';

export const environment = {
  production: false,
  api: {
    auth: {
      baseUrl: `${baseUrl}/auth`
    },
    sessions: {
      baseUrl: `${baseUrl}/sessions`
    },
    teachers: {
      baseUrl: `${baseUrl}/teachers`
    },
    users: {
      baseUrl: `${baseUrl}/users`
    }
  }
};
