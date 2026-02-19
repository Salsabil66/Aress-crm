import { v4 as uuidv4 } from 'uuid';
import type { User, LoginCredentials, RegisterData } from './auth.types';

const USERS_KEY = 'aress_users';
const SESSION_KEY = 'aress_session';

interface StoredUser extends User {
  password: string;
}

const SEED_USERS: StoredUser[] = [
  {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@aress.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: uuidv4(),
    name: 'Sarah Connor',
    email: 'sarah@aress.com',
    password: 'sarah123',
    role: 'sales_rep',
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: uuidv4(),
    name: 'John Manager',
    email: 'john@aress.com',
    password: 'john123',
    role: 'manager',
    createdAt: '2025-02-01T00:00:00Z',
  },
];

function getUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  return JSON.parse(stored);
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(user: StoredUser): User {
  const { password: _password, ...publicUser } = user;
  void _password;
  return publicUser;
}

export const authService = {
  login: (credentials: LoginCredentials): User | null => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) return null;
    const publicUser = toPublicUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  register: (data: RegisterData): User | null => {
    const users = getUsers();
    if (users.find((u) => u.email === data.email)) return null;
    const newUser: StoredUser = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'sales_rep',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    const publicUser = toPublicUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  logout: (): void => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  },

  updateProfile: (userId: string, data: { name: string; email: string }): User | null => {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    saveUsers(users);
    const publicUser = toPublicUser(users[index]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
  },
};
