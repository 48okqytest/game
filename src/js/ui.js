// UI Module
export function initUI() {
    // Page navigation
    const navLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page');
    
    // Function to show a specific page
    function showPage(pageId) {
        // Update active nav link
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Show selected page
        pages.forEach(page => {
            if (page.id === `${pageId}-page`) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        
        // Update URL without reloading
        history.pushState({}, '', `#${pageId}`);
    }
    
    // Handle nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Handle initial page load based on hash
    function handleInitialPage() {
        const hash = window.location.hash.substring(1);
        const validPages = ['home', 'slots', 'coinflip', 'rocket', 'cases', 'battles'];
        
        if (hash && validPages.includes(hash)) {
            showPage(hash);
        } else {
            showPage('home');
        }
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', handleInitialPage);
    
    // Initialize the correct page
    handleInitialPage();
    
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
