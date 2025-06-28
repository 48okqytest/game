// UI Module
export function initUI() {
    // Page navigation
    const navLinks = document.querySelectorAll('.main-nav a');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Show selected page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${pageId}-page`).classList.add('active');
            
            // Handle game card clicks from home page
            if (link.classList.contains('game-card')) {
                document.querySelector(`.main-nav a[data-page="${pageId}"]`).click();
            }
        });
    });
    
    // User menu toggle
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    
    loginBtn.addEventListener('click', () => {
        document.getElementById('login-modal').classList.add('active');
    });
    
    // Modal handling
    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.remove('active');
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Auth toggle
    const authToggle = document.getElementById('register-toggle');
    if (authToggle) {
        authToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const authForm = document.getElementById('auth-form');
            const submitBtn = authForm.querySelector('button[type="submit"]');
            const toggleText = authForm.querySelector('.auth-toggle');
            
            if (submitBtn.textContent === 'Login') {
                submitBtn.textContent = 'Register';
                toggleText.innerHTML = 'Already have an account? <a href="#" id="login-toggle">Login</a>';
            } else {
                submitBtn.textContent = 'Login';
                toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="register-toggle">Register</a>';
            }
        });
    }
}
