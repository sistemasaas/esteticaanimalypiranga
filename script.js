// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const backToTopBtn = document.getElementById('backToTop');
const scheduleModal = document.getElementById('scheduleModal');
const scheduleBtn = document.getElementById('scheduleBtn');
const heroScheduleBtn = document.getElementById('heroScheduleBtn');
const closeModal = document.querySelectorAll('.close');
const scheduleForm = document.getElementById('scheduleForm');
const contactForm = document.getElementById('contactForm');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const tabButtons = document.querySelectorAll('.tab-btn');
const productCategories = document.querySelectorAll('.product-category');

// Carrinho de compras
let cart = [];

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalFunc(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners for Modals
scheduleBtn.addEventListener('click', () => openModal(scheduleModal));
heroScheduleBtn.addEventListener('click', () => openModal(scheduleModal));
cartButton.addEventListener('click', () => openModal(cartModal));
checkoutBtn.addEventListener('click', () => {
    closeModalFunc(cartModal);
    openModal(checkoutModal);
    updateCheckoutItems();
});

// Close modals when clicking on X
closeModal.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModalFunc(modal);
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModalFunc(e.target);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style="display: block;"]');
        if (openModal) {
            closeModalFunc(openModal);
        }
    }
});

// Adicionar ao carrinho
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        const price = parseFloat(this.getAttribute('data-price'));
        
        cart.push({
            service,
            price
        });
        
        updateCart();
        showNotification(`${service} adicionado ao carrinho!`, 'success');
    });
});

// Atualizar carrinho
function updateCart() {
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio</p>';
        cartTotal.textContent = 'R$ 0,00';
        checkoutBtn.style.display = 'none';
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.service}</span>
                    <span class="cart-item-price">R$ ${item.price.toFixed(2)}</span>
                </div>
                <button class="remove-item-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        checkoutBtn.style.display = 'block';
        
        // Adicionar eventos para remover itens
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
}

// Atualizar itens no checkout
function updateCheckoutItems() {
    checkoutItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <span>${item.service}</span>
            <span>R$ ${item.price.toFixed(2)}</span>
        `;
        
        checkoutItems.appendChild(itemElement);
    });
    
    checkoutTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Finalizar compra (enviar para WhatsApp)
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('checkoutName').value;
    const phone = document.getElementById('checkoutPhone').value;
    const petName = document.getElementById('checkoutPetName').value;
    const cep = document.getElementById('checkoutCep').value;
    const address = document.getElementById('checkoutAddress').value;
    
    // Criar mensagem para WhatsApp
    let message = `🐾 *PEDIDO - ESTÉTICA ANIMAL YPIRANGA* 🐾\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📞 *Telefone:* ${phone}\n`;
    message += `🐕 *Pet:* ${petName}\n`;
    
    if (cep) message += `📮 *CEP:* ${cep}\n`;
    if (address) message += `🏠 *Endereço:* ${address}\n\n`;
    
    message += `🛒 *Itens do Pedido:*\n`;
    cart.forEach(item => {
        message += `• ${item.service} - R$ ${item.price.toFixed(2)}\n`;
    });
    
    message += `\n💵 *Total:* R$ ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}\n\n`;
    message += `Aguardo confirmação! 🐕🐱`;
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5561992069975?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Limpar carrinho e fechar modais
    cart = [];
    updateCart();
    closeModalFunc(checkoutModal);
    
    // Mostrar mensagem de sucesso
    showNotification('Pedido enviado! Você será redirecionado para o WhatsApp.', 'success');
});

// Abas de produtos
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Esconder todas as categorias
        productCategories.forEach(category => {
            category.style.display = 'none';
        });
        
        // Mostrar a categoria correspondente
        const categoryId = button.getAttribute('data-category') + '-products';
        document.getElementById(categoryId).style.display = 'block';
    });
});

// Schedule Form Submission
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        petName: document.getElementById('petName').value,
        ownerName: document.getElementById('ownerName').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        observations: document.getElementById('observations').value
    };
    
    // Format date
    const dateObj = new Date(formData.date);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    
    // Create WhatsApp message
    const message = `🐾 *AGENDAMENTO - ESTÉTICA ANIMAL YPIRANGA* 🐾

📋 *Dados do Agendamento:*
• Pet: ${formData.petName}
• Tutor: ${formData.ownerName}
• Telefone: ${formData.phone}
• Serviço: ${formData.service}
• Data: ${formattedDate}
• Horário: ${formData.time}

📝 *Observações:*
${formData.observations || 'Nenhuma observação adicional'}

Aguardo confirmação! 🐕🐱`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5561992069975?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Close modal and reset form
    closeModalFunc(scheduleModal);
    scheduleForm.reset();
    
    // Show success message
    showNotification('Agendamento enviado! Você será redirecionado para o WhatsApp.', 'success');
});

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
    const phone = formData.get('phone') || contactForm.querySelector('input[type="tel"]').value;
    const message = formData.get('message') || contactForm.querySelector('textarea').value;
    
    const whatsappMessage = `🐾 *CONTATO - ESTÉTICA ANIMAL YPIRANGA* 🐾

👤 *Nome:* ${name}
📞 *Telefone:* ${phone}

💬 *Mensagem:*
${message}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/5561992069975?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    contactForm.reset();
    
    showNotification('Mensagem enviada! Você será redirecionado para o WhatsApp.', 'success');
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item, .product-card');
    animateElements.forEach(el => observer.observe(el));
});

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Service Cards Hover Effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery Lightbox Effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;
        
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            cursor: pointer;
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            color: #FFD700;
            font-size: 2rem;
            cursor: pointer;
        `;
        
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 10px;
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close lightbox
        const closeLightbox = () => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        };
        
        lightbox.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        
        // Prevent closing when clicking on image
        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ff4444';
            isValid = false;
        } else {
            input.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        }
    });
    
    return isValid;
}

// Phone Number Formatting
document.getElementById('phone').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (value.length < 14) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
    }
    e.target.value = value;
});

// Date Input Validation (only future dates)
document.getElementById('date').addEventListener('change', (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        e.target.value = '';
        showNotification('Por favor, selecione uma data futura.', 'error');
    }
});

// Set minimum date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
});

// Loading Animation for Forms
function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Enviando...';
    button.disabled = true;
    button.classList.add('loading');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    }, 2000);
}

// Add loading to form submissions
scheduleForm.addEventListener('submit', (e) => {
    const submitBtn = scheduleForm.querySelector('.submit-btn');
    showLoading(submitBtn);
});

contactForm.addEventListener('submit', (e) => {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    showLoading(submitBtn);
});

// Lazy Loading for Images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Performance Optimization
window.addEventListener('load', () => {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Preload critical images
    const criticalImages = [
        'public/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.error);
    // You could send this to a logging service
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}