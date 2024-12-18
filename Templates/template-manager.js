class NavComponent extends HTMLElement {
    constructor() {
        super();
        // Bind methods to the current context
        this.handleResize = this.handleResize.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    async connectedCallback() {
        // Initial load of the navbar
        await this.loadNavBar();

        // Listen for window resize events
        window.addEventListener('resize', this.handleResize);

        // Set up event listeners for dropdowns and outside clicks
        this.addEventListeners();
    }

    disconnectedCallback() {
        // Clean up the resize event listener and outside click listener
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleOutsideClick);
    }

    // Handle resize events with debouncing
    handleResize() {
        // Debounce the resizing to avoid too many fetch requests
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(async () => {
            // Clear the current content before fetching the new navbar
            this.innerHTML = '';
            await this.loadNavBar();
        }, 200); // 200ms debounce time
    }

    // Fetch and load the appropriate navbar based on screen width
    async loadNavBar() {
        const navbarTemplate = await this.GetNavBar();
        this.innerHTML = navbarTemplate; // Set the new navbar content

        // Re-add event listeners after loading new navbar content
        this.addEventListeners();
    }

    // Fetch the correct navbar based on the screen size
    async GetNavBar() {
        const width = document.body.clientWidth;  // Get the screen width
        if (width < 850) {
            const response = await fetch('/Templates/nav-menu-mobile.html');
            return response.text();  // Return the text content of the mobile navbar
        } else {
            const response = await fetch('/Templates/nav-menu.html');
            return response.text();  // Return the text content of the desktop navbar
        }
    }

    // Function to toggle the mobile navigation menu visibility
    toggleMenu() {
        const navList = this.querySelector('.mobile-nav-list');
        if (navList) {
            navList.classList.toggle('active');
        }
    }

    // Function to toggle the dropdown menu on click
    toggleDropdown(event) {
        const parentLi = event.target.closest('li');
        parentLi.classList.toggle('active');
    }

    // Add event listeners for menu toggle and dropdowns
    addEventListeners() {
        // Find the hamburger menu button and attach the toggleMenu method
        const menuToggle = this.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.removeEventListener('click', this.toggleMenu); // Remove any existing listener
            menuToggle.addEventListener('click', this.toggleMenu);  // Add listener again
        }

        // Attach event listeners to dropdown toggles
        const dropdowns = this.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', this.toggleDropdown);
        });

        // Add a click event listener to detect clicks outside the navbar
        document.addEventListener('click', this.handleOutsideClick);
    }

    // Handle clicks outside of the navbar to close the menu
    handleOutsideClick(event) {
        const nav = this.querySelector('nav');
        const navList = this.querySelector('.mobile-nav-list');
        const menuToggle = this.querySelector('.menu-toggle');

        // If the click is outside the nav or toggle button, close the menu
        if (navList && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
            navList.classList.remove('active');
        }
    }
}

// Define the custom element
customElements.define('custom-nav', NavComponent);
