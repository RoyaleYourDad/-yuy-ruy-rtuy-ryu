// ============================================
// UTILITIES - Additional Helper Functions
// ============================================

// Format currency
function formatCurrency(amount, currency = 'UZS') {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(date, format = 'long') {
    const d = new Date(date);
    const options = {
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        relative: { style: 'relative' }
    };
    
    if (format === 'relative') {
        const now = new Date();
        const diff = now - d;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Bugun';
        if (days === 1) return 'Kecha';
        if (days < 7) return `${days} kun oldin`;
        if (days < 30) return `${Math.floor(days / 7)} hafta oldin`;
        return d.toLocaleDateString('uz-UZ', options.long);
    }
    
    return d.toLocaleDateString('uz-UZ', options[format] || options.long);
}

// Phone number formatter
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.startsWith('998')) value = value.slice(3);
    
    const match = value.match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (match) {
        input.value = !match[2] ? match[1] : 
            `+998 ${match[1]} ${match[2]}${match[3] ? ` ${match[3]}` : ''}${match[4] ? ` ${match[4]}` : ''}`;
    }
}

// Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone
function isValidPhone(phone) {
    return /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/.test(phone);
}

// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// LocalStorage helpers with expiration
const storage = {
    set: (key, value, ttl = null) => {
        const item = {
            value: value,
            timestamp: Date.now(),
            ttl: ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    get: (key) => {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.value;
    },
    
    remove: (key) => localStorage.removeItem(key),
    
    clear: () => localStorage.clear()
};

// API simulation
const api = {
    async get(url) {
        await new Promise(r => setTimeout(r, 500));
        return { success: true, data: [] };
    },
    
    async post(url, data) {
        await new Promise(r => setTimeout(r, 800));
        return { success: true, data: { id: generateId(), ...data } };
    },
    
    async put(url, data) {
        await new Promise(r => setTimeout(r, 600));
        return { success: true, data };
    },
    
    async delete(url) {
        await new Promise(r => setTimeout(r, 400));
        return { success: true };
    }
};

// Form validation helper
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    const errors = [];
    
    inputs.forEach(input => {
        input.classList.remove('error');
        
        if (input.required && !input.value.trim()) {
            errors.push({ field: input, message: 'Bu maydon to\'ldirilishi shart' });
            input.classList.add('error');
        }
        
        if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            errors.push({ field: input, message: 'Noto\'g\'ri email formati' });
            input.classList.add('error');
        }
        
        if (input.type === 'tel' && input.value && !isValidPhone(input.value)) {
            errors.push({ field: input, message: 'Noto\'g\'ri telefon formati' });
            input.classList.add('error');
        }
    });
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Show field error
function showFieldError(input, message) {
    const existing = input.parentElement.querySelector('.field-error');
    if (existing) existing.remove();
    
    const error = document.createElement('span');
    error.className = 'field-error';
    error.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
    error.textContent = message;
    input.parentElement.appendChild(error);
    input.classList.add('error');
}

// Clear field errors
function clearFieldErrors(form) {
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Nusxa olindi!');
        return true;
    } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showToast('Nusxa olindi!');
            return true;
        } catch (e) {
            showToast('Nusxa olish muvaffaqiyatsiz', 'error');
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

// Share functionality
async function share(data) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: data.title || 'Legal AI Uzbekistan',
                text: data.text || '',
                url: data.url || window.location.href
            });
        } catch (err) {
            console.log('Share cancelled');
        }
    } else {
        copyToClipboard(data.url || window.location.href);
    }
}

// Online/offline detection
window.addEventListener('online', () => {
    showToast('Internet aloqasi tiklandi', 'success');
});

window.addEventListener('offline', () => {
    showToast('Internet aloqasi yo\'q', 'warning');
});

// Before unload warning for forms
let formDirty = false;

function setFormDirty(dirty = true) {
    formDirty = dirty;
}

window.addEventListener('beforeunload', (e) => {
    if (formDirty) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Initialize phone formatters
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', () => formatPhone(input));
    });
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In production, register actual service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Expose utilities globally
window.utils = {
    formatCurrency,
    formatDate,
    formatPhone,
    isValidEmail,
    isValidPhone,
    generateId,
    deepClone,
    debounce: (fn, ms) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), ms);
        };
    },
    throttle,
    storage,
    api,
    validateForm,
    showFieldError,
    clearFieldErrors,
    copyToClipboard,
    share,
    setFormDirty
};