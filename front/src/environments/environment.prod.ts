const baseUrl = 'http://localhost:8080/api';

export const environment = {
  production: true,
  api: {
    auth: {
      baseUrl: `${baseUrl}/v1/auth`
    },
    sessions: {
      baseUrl: `${baseUrl}/v1/sessions`
    },
    teachers: {
      baseUrl: `${baseUrl}/v1/teachers`
    },
    users: {
      baseUrl: `${baseUrl}/v1/users`
    }
  }
};
