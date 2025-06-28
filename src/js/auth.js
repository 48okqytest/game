// Authentication Module
export function initAuth() {
    const authForm = document.getElementById('auth-form');
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const isLogin = authForm.querySelector('button[type="submit"]').textContent === 'Login';
            
            // Fake authentication
            if (username && password) {
                // Close modal
                document.getElementById('login-modal').classList.remove('active');
                
                // Update UI
                loginBtn.textContent = username;
                loginBtn.innerHTML = `<i class="fas fa-user"></i> ${username}`;
                userMenu.classList.remove('hidden');
                
                // Store fake user data
                localStorage.setItem('fakeUser', JSON.stringify({
                    username,
                    balance: 10000
                }));
            }
        });
    }
    
    // Check for existing session
    const fakeUser = localStorage.getItem('fakeUser');
    if (fakeUser) {
        const userData = JSON.parse(fakeUser);
        loginBtn.textContent = userData.username;
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${userData.username}`;
        userMenu.classList.remove('hidden');
        updateBalance(userData.balance);
    }
}
