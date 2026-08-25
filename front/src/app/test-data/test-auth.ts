import { LoginRequest } from "@app/core/models/loginRequest.interface";
import { RegisterRequest } from "@app/core/models/registerRequest.interface";
import { SessionInformation } from "@app/core/models/sessionInformation.interface";


export const TEST_LOGIN_REQUEST: LoginRequest = {
    email: 'test@test.com',
    password: 'password123'
};

export const TEST_LOGIN_ERROR_REQUEST: LoginRequest = {
    email: 'test.test',
    password: 'pa'
}

export const TEST_REGISTER_REQUEST: RegisterRequest = {
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123'
};

export const TEST_SESSION_INFORMATION: SessionInformation = {
    id: 1,
    token: 'fake-jwt-token',
    type: 'Bearer',
    username: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
};

export const TEST_SESSION_INFORMATION_ADMIN: SessionInformation = {
    id: 1,
    token: 'fake-jwt-token',
    type: 'Bearer',
    username: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: true
};