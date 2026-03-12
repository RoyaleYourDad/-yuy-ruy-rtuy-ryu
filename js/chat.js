// ============================================
// LEGAL AI CHATBOT
// ============================================

const chatResponses = {
    'ishdan': `Mehnat kodeksining 100-moddasiga ko'ra, ish beruvchi mehnat shartnomasini faqat qonunda ko'rsatilgan asoslar bo'yicha tugatishi mumkin.

**Ogohlantirishsiz bo'shatishga yo'l qo'yilmaydi!** Agar sizga ogohlantirishsiz bo'shatish xabarnomasi berilgan bo'lsa, bu qonunga ziddir.

Siz quyidagi huquqlaringizni himoya qilishingiz mumkin:
1. Ish beruvchidan yozma asos talab qiling
2. Profsoyuzga murojaat qiling (agar mavjud bo'lsa)
3. Mehnat inspeksiyasiga shikoyat qiling
4. Sudga da'vo arizasi bilan murojaat qiling

Sudga murojaat qilish muddati - **3 oy** (Mehnat kodeksi 242-modda).`,

    'shartnoma': `Shartnoma tuzish bo'yicha maslahatlar:

**Asosiy qoidalar:**
1. Shartnoma bevosita yoki elektron tarzda tuzilishi mumkin
2. Shartnoma ikki nusxada tuziladi
3. Shartnoma shartlari o'zaro kelishuv asosida belgilanadi

**Majburiy shartlar:**
- Tomonlarning nomi va rekvizitlari
- Shartnoma predmeti
- Hukmlar va majburiyatlar
- Narxlari va to'lov tartibi
- Shartnoma muddati
- Force majeure holatlari
- Nizolar hal qilish tartibi

Agar konkret shartnoma turi haqida ma'lumot kerak bo'lsa, ayting: mehnat, ijara, sotish yoki boshqa?`,

    'nikoh': `Nikoh va oilaviy masalalar bo'yicha:

**Nikoh shartnomasi (prenup):**
- Nikohdan oldin tuziladi
- Mol-mulk nizolarini oldini oladi
- Ixtiyoriy hujjat

**Ajrashish bo'yicha:**
- Sud orqali yoki ro'yxatdan o'tish orqali
- Farzandlar manfaati birinchi o'rinda
- Aliment to'lovlari (oylik daromadning 25%-50%)

**Aliment:**
- 1 farzand - 25%
- 2 farzand - 33%
- 3 va undan ortiq - 50%

Qaysi mavzu bo'yicha batafsil ma'lumot kerak?`,

    'mehnat': `Mehnat huquqi bo'yicha asosiy ma'lumotlar:

**Mehnat shartnomasi:**
- Yozma shaklda tuziladi
- 2 nusxada (ish beruvchi va xodimga)
- Mehnat funksiyasi, ish haqi, ish vaqti ko'rsatiladi

**Ish vaqti:**
- Odatda 40 soat/hafta
- 18 yoshgacha - 24-35 soat/hafta
- Tungi vaqtda ish - qisqartirilgan

**Ta'tillar:**
- Mehnat ta'tili - 15 kundan boshlab
- Homiladorlik va tug'ish - 126 kun (70+56)
- Bolaning 2 yoshgacha - ta'til uzaytiriladi

**Ishdan bo'shatish:**
- O'z xohishi bilan (2 hafta oldin ogohlantirish)
- Ish beruvchi tashabbusi (ogohlantirish bilan)
- Shartnomaning amal qilish muddati tugaganda

Savolingiz aniqroq bo'lsa, yordam beraman.`,

    'meros': `Meros huquqi bo'yicha:

**Vorislik navbatlari:**
1. Birinchi navbat - turmush o'rtoqlari, farzandlar, ota-ona
2. Ikkinchi navbat - aka-uka, opa-singillar, buva-buvilar
3. Uchinchi navbat - amaki-xolalar, tog'a-xolalar

**Yakuniy meros:**
- Vasiyatnoma mavjud bo'lmasa, qonun bo'yicha taqsimlanadi
- Turmush o'rtoq - mulkning 50% + merosdan ulushi
- Vasiyatnoma erkin shaklda tuziladi

**Merosdan mahrum qilish:**
- Vasiyatnoma bilan
- Sud qarori bilan (vafot etgan oldidan o'zini tutmaganlar)

Qaysi mavzu bo'yicha batafsil ma'lumot kerak?`,

    'default': `Tushunmadim. Iltimos, savolingizni aniqroq ayting.

Mavjud mavzular:
- Mehnat huquqi (ishdan bo'shatish, mehnat shartnomasi)
- Oilaviy huquq (nikoh, ajrashish, aliment)
- Shartnomalar (ijara, sotish, ish)
- Meros huquqi
- Ko'chmas mulk
- Migratsiya

Yoki yuristlarimizga murojaat qilishingiz mumkin.`
};

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';
    
    // Hide suggestions after first message
    const suggestions = document.getElementById('quickSuggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'ai');
    }, 1500);
}

function sendQuickMessage(topic) {
    const input = document.getElementById('messageInput');
    input.value = topic;
    sendMessage();
}

function addMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message fade-in-up`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    if (sender === 'ai') {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '🤖';
        messageDiv.appendChild(avatar);
        
        // Format AI response with markdown-like syntax
        content.innerHTML = formatResponse(text);
    } else {
        const p = document.createElement('p');
        p.textContent = text;
        content.appendChild(p);
    }
    
    messageDiv.appendChild(content);
    container.appendChild(messageDiv);
    
    scrollToBottom();
}

function formatResponse(text) {
    // Convert markdown-like syntax to HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/(\d+\.)\s/g, '<br>$1 ')
        .replace(/•\s/g, '<br>• ');
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    container.appendChild(typingDiv);
    scrollToBottom();
    
    // Add typing animation styles
    if (!document.getElementById('typingStyles')) {
        const style = document.createElement('style');
        style.id = 'typingStyles';
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 4px 0;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: var(--text-muted);
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, response] of Object.entries(chatResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    return chatResponses.default;
}

function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    container.scrollTop = container.scrollHeight;
}

function startNewChat() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = `
        <div class="message ai-message fade-in-up">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>Salom! Men Legal AI yordamchisiman. O'zbekiston qonunchiligiga oid savollaringizga javob beraman.</p>
                <p>Savolingizni yozing yoki quyidagi tezkor tugmalardan foydalaning:</p>
            </div>
        </div>
    `;
    
    // Show suggestions again
    const suggestions = document.getElementById('quickSuggestions');
    if (suggestions) {
        suggestions.style.display = 'flex';
    }
}

function loadChat(chatId) {
    // Update active state in sidebar
    document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // In a real app, this would load chat history from server
    // For demo, we'll just show a toast
    showToast('Suhbat yuklandi');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--text);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius);
        font-size: 0.875rem;
        z-index: 3000;
        animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Sidebar toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('chatSidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});