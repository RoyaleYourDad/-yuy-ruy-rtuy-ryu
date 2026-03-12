// ============================================
// FILTERING AND SEARCH FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initLawyerFilters();
    initJobFilters();
    initSearch();
});

// Lawyer Filters
function initLawyerFilters() {
    const specializationFilter = document.getElementById('specializationFilter');
    const locationFilter = document.getElementById('locationFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('lawyerSearch');
    const grid = document.getElementById('lawyersGrid');
    
    if (!grid) return;
    
    const cards = grid.querySelectorAll('.lawyer-card');
    
    function filterLawyers() {
        const spec = specializationFilter ? specializationFilter.value : '';
        const loc = locationFilter ? locationFilter.value : '';
        const price = priceFilter ? priceFilter.value : '';
        const search = searchInput ? searchInput.value.toLowerCase() : '';
        
        cards.forEach(card => {
            const cardSpec = card.getAttribute('data-specialization');
            const cardLoc = card.getAttribute('data-location');
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const cardName = card.querySelector('h3').textContent.toLowerCase();
            const cardSpecText = card.querySelector('.specialization').textContent.toLowerCase();
            
            let show = true;
            
            if (spec && cardSpec !== spec) show = false;
            if (loc && cardLoc !== loc) show = false;
            
            if (price) {
                if (price === '0-200' && cardPrice > 200) show = false;
                if (price === '200-400' && (cardPrice < 200 || cardPrice > 400)) show = false;
                if (price === '400+' && cardPrice < 400) show = false;
            }
            
            if (search && !cardName.includes(search) && !cardSpecText.includes(search)) {
                show = false;
            }
            
            card.style.display = show ? '' : 'none';
            
            // Animate visible cards
            if (show) {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s ease';
                }, 10);
            }
        });
    }
    
    if (specializationFilter) specializationFilter.addEventListener('change', filterLawyers);
    if (locationFilter) locationFilter.addEventListener('change', filterLawyers);
    if (priceFilter) priceFilter.addEventListener('change', filterLawyers);
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterLawyers, 300));
    }
}

// Job Filters
function initJobFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const budgetFilter = document.getElementById('budgetFilter');
    const urgencyFilter = document.getElementById('urgencyFilter');
    const list = document.getElementById('jobsList');
    
    if (!list) return;
    
    const cards = list.querySelectorAll('.job-card');
    
    function filterJobs() {
        const cat = categoryFilter ? categoryFilter.value : '';
        const budget = budgetFilter ? budgetFilter.value : '';
        const urgency = urgencyFilter ? urgencyFilter.value : '';
        
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            const cardBudget = parseInt(card.getAttribute('data-budget'));
            const cardUrgency = card.getAttribute('data-urgency');
            
            let show = true;
            
            if (cat && cardCat !== cat) show = false;
            
            if (budget) {
                if (budget === '0-500' && cardBudget > 500) show = false;
                if (budget === '500-1000' && (cardBudget < 500 || cardBudget > 1000)) show = false;
                if (budget === '1000+' && cardBudget < 1000) show = false;
            }
            
            if (urgency && cardUrgency !== urgency) show = false;
            
            card.style.display = show ? '' : 'none';
        });
    }
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterJobs);
    if (budgetFilter) budgetFilter.addEventListener('change', filterJobs);
    if (urgencyFilter) urgencyFilter.addEventListener('change', filterJobs);
}

// Search functionality
function initSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="qidirish"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            const term = this.value.toLowerCase();
            const cards = document.querySelectorAll('.lawyer-card, .job-card, .template-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isMatch = text.includes(term);
                
                card.style.display = isMatch || term === '' ? '' : 'none';
                
                // Highlight matching text
                if (isMatch && term !== '') {
                    highlightText(card, term);
                } else {
                    removeHighlight(card);
                }
            });
        }, 300));
    });
}

function highlightText(element, term) {
    // Simple highlight implementation
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(term)) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(node => {
        const span = document.createElement('span');
        span.className = 'highlight';
        span.style.cssText = 'background: rgba(212, 175, 55, 0.3); padding: 0 2px; border-radius: 2px;';
        
        const regex = new RegExp(`(${term})`, 'gi');
        const parts = node.nodeValue.split(regex);
        
        parts.forEach((part, i) => {
            if (part.toLowerCase() === term.toLowerCase()) {
                const mark = document.createElement('mark');
                mark.style.cssText = 'background: rgba(212, 175, 55, 0.4); color: inherit; padding: 0 2px; border-radius: 2px;';
                mark.textContent = part;
                node.parentNode.insertBefore(mark, node);
            } else {
                node.parentNode.insertBefore(document.createTextNode(part), node);
            }
        });
        
        node.parentNode.removeChild(node);
    });
}

function removeHighlight(element) {
    const marks = element.querySelectorAll('mark');
    marks.forEach(mark => {
        const text = document.createTextNode(mark.textContent);
        mark.parentNode.replaceChild(text, mark);
    });
    
    // Normalize text nodes
    element.normalize();
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sort functionality
function sortLawyers(criteria) {
    const grid = document.getElementById('lawyersGrid');
    if (!grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.lawyer-card'));
    
    cards.sort((a, b) => {
        if (criteria === 'rating') {
            const ratingA = parseFloat(a.querySelector('.rating-score').textContent);
            const ratingB = parseFloat(b.querySelector('.rating-score').textContent);
            return ratingB - ratingA;
        }
        if (criteria === 'price-low') {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            return priceA - priceB;
        }
        if (criteria === 'price-high') {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            return priceB - priceA;
        }
        if (criteria === 'experience') {
            const expA = parseInt(a.querySelector('.stat-value').textContent);
            const expB = parseInt(b.querySelector('.stat-value').textContent);
            return expB - expA;
        }
        return 0;
    });
    
    cards.forEach(card => grid.appendChild(card));
}