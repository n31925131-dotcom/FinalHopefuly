// Contact Form Handling

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !message) {
                showStatus('error', 'Please fill in all required fields.');
                return;
            }

            // Construct mailto link
            const subject = `New Inquiry from ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            
            // Open default mail client
            window.location.href = `mailto:annantakaki9@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

            // Show success message (since we can't track mailto success)
            showStatus('success', 'Opening your email client...');
            contactForm.reset();
        });
    }

    function showStatus(type, message) {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.className = `p-4 rounded-lg mb-6 ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
        formStatus.style.display = 'block';

        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});
