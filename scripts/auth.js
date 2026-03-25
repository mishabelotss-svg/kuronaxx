// scripts/auth.js

// Ключи для localStorage
const USERS_KEY = 'kuronaxx_users';
const CURRENT_USER_KEY = 'kuronaxx_current_user';

// Получить всех пользователей
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Сохранить пользователя
function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Найти пользователя по email
function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
}

// Проверить пароль (простейшая проверка, в реальном проекте нужно хешировать)
function checkPassword(user, password) {
    return user.password === password;
}

// Зарегистрировать нового пользователя
function registerUser(email, password, name) {
    // Проверяем, существует ли уже такой email
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        return { success: false, message: 'Пользователь с таким email уже существует' };
    }
    
    // Создаём нового пользователя
    const newUser = {
        id: Date.now(),
        email: email,
        password: password,
        name: name,
        createdAt: new Date().toISOString()
    };
    
    saveUser(newUser);
    return { success: true, message: 'Регистрация успешна! Теперь войдите.' };
}

// Войти в систему
function loginUser(email, password) {
    const user = findUserByEmail(email);
    if (!user) {
        return { success: false, message: 'Пользователь не найден' };
    }
    if (!checkPassword(user, password)) {
        return { success: false, message: 'Неверный пароль' };
    }
    
    // Сохраняем текущего пользователя
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name
    }));
    
    return { success: true, message: 'Вход выполнен успешно!', user: user };
}

// Выход из системы
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

// Получить текущего пользователя
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Проверить, авторизован ли пользователь
function isLoggedIn() {
    return getCurrentUser() !== null;
}