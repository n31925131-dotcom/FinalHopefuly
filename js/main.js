document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    // Check if the link's href matches the current path
    // Need to handle "index.html" vs root "/"
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || 
       (currentPath.endsWith('/') && linkPath === 'index.html') ||
       (currentPath.endsWith('index.html') && linkPath === 'index.html')) {
      link.classList.add('text-rose-600');
    }
  });
});
