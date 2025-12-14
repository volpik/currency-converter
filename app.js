/**
 * Currency Converter App
 * Utilizza l'API gratuita Frankfurter (basata su tassi BCE)
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const CURRENCIES = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'USD', name: 'Dollaro USA', flag: '🇺🇸' },
    { code: 'HKD', name: 'Dollaro HK', flag: '🇭🇰' },
    { code: 'AED', name: 'Dirham UAE', flag: '🇦🇪' },
    { code: 'VND', name: 'Dong Vietnam', flag: '🇻🇳' },
    { code: 'THB', name: 'Baht Thai', flag: '🇹🇭' },
    { code: 'RUB', name: 'Rublo Russo', flag: '🇷🇺' },
    { code: 'AUD', name: 'Dollaro AUS', flag: '🇦🇺' }
];

const API_BASE = 'https://api.frankfurter.app';
const CACHE_KEY = 'currency_rates_cache';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 ore in millisecondi

// ═══════════════════════════════════════════════════════════════
// STATO APPLICAZIONE
// ═══════════════════════════════════════════════════════════════

let state = {
    baseCurrency: 'EUR',
    amount: 1000,
    rates: {},
    lastUpdate: null,
    isLoading: false
};

// ═══════════════════════════════════════════════════════════════
// ELEMENTI DOM
// ═══════════════════════════════════════════════════════════════

const elements = {
    amountInput: document.getElementById('amount-input'),
    baseCurrencyBtn: document.getElementById('base-currency-btn'),
    baseFlag: document.getElementById('base-flag'),
    baseCode: document.getElementById('base-code'),
    baseDropdown: document.getElementById('base-dropdown'),
    baseCurrencySelector: document.getElementById('base-currency-selector'),
    conversionsGrid: document.getElementById('conversions-grid'),
    lastUpdate: document.getElementById('last-update'),
    refreshBtn: document.getElementById('refresh-btn')
};

// ═══════════════════════════════════════════════════════════════
// API & CACHE
// ═══════════════════════════════════════════════════════════════

async function fetchRates(baseCurrency) {
    const targetCurrencies = CURRENCIES
        .map(c => c.code)
        .filter(c => c !== baseCurrency)
        .join(',');
    
    const url = `${API_BASE}/latest?from=${baseCurrency}&to=${targetCurrencies}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        return {
            base: data.base,
            rates: data.rates,
            date: data.date,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function getCachedRates() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        
        // Cache valida se meno di CACHE_DURATION
        if (age < CACHE_DURATION) {
            return data;
        }
        return null;
    } catch {
        return null;
    }
}

function setCachedRates(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Cache write failed:', e);
    }
}

async function loadRates(forceRefresh = false) {
    state.isLoading = true;
    renderConversions();
    
    try {
        // Prova prima la cache (se non forceRefresh)
        if (!forceRefresh) {
            const cached = getCachedRates();
            if (cached && cached.base === state.baseCurrency) {
                state.rates = cached.rates;
                state.lastUpdate = new Date(cached.timestamp);
                state.isLoading = false;
                updateLastUpdateDisplay();
                renderConversions();
                
                // Aggiorna in background se cache > 1 ora
                const age = Date.now() - cached.timestamp;
                if (age > 60 * 60 * 1000) {
                    refreshRatesInBackground();
                }
                return;
            }
        }
        
        // Fetch nuovi tassi
        const data = await fetchRates(state.baseCurrency);
        state.rates = data.rates;
        state.lastUpdate = new Date(data.timestamp);
        
        // Salva in cache
        setCachedRates({
            ...data,
            base: state.baseCurrency
        });
        
    } catch (error) {
        // Fallback su cache scaduta se disponibile
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const data = JSON.parse(cached);
                if (data.base === state.baseCurrency) {
                    state.rates = data.rates;
                    state.lastUpdate = new Date(data.timestamp);
                    elements.lastUpdate.classList.add('error');
                }
            }
        } catch {}
        
        console.error('Failed to load rates:', error);
    }
    
    state.isLoading = false;
    updateLastUpdateDisplay();
    renderConversions();
}

async function refreshRatesInBackground() {
    try {
        const data = await fetchRates(state.baseCurrency);
        state.rates = data.rates;
        state.lastUpdate = new Date(data.timestamp);
        setCachedRates({ ...data, base: state.baseCurrency });
        updateLastUpdateDisplay();
        renderConversions();
    } catch {}
}

// ═══════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════

function renderCurrencyDropdown() {
    elements.baseDropdown.innerHTML = CURRENCIES.map(currency => `
        <div class="currency-option ${currency.code === state.baseCurrency ? 'selected' : ''}" 
             data-code="${currency.code}">
            <span class="currency-flag">${currency.flag}</span>
            <span class="currency-code">${currency.code}</span>
            <span class="currency-name">${currency.name}</span>
        </div>
    `).join('');
    
    // Event listeners
    elements.baseDropdown.querySelectorAll('.currency-option').forEach(option => {
        option.addEventListener('click', () => {
            const code = option.dataset.code;
            if (code !== state.baseCurrency) {
                state.baseCurrency = code;
                updateBaseCurrencyDisplay();
                closeCurrencyDropdown();
                loadRates(true);
            } else {
                closeCurrencyDropdown();
            }
        });
    });
}

function updateBaseCurrencyDisplay() {
    const currency = CURRENCIES.find(c => c.code === state.baseCurrency);
    elements.baseFlag.textContent = currency.flag;
    elements.baseCode.textContent = currency.code;
    
    // Aggiorna selezione nel dropdown
    elements.baseDropdown.querySelectorAll('.currency-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.code === state.baseCurrency);
    });
}

function renderConversions() {
    const targetCurrencies = CURRENCIES.filter(c => c.code !== state.baseCurrency);
    
    // Aggiungi anche la valuta base per mostrare l'importo originale
    const allCurrencies = [
        CURRENCIES.find(c => c.code === state.baseCurrency),
        ...targetCurrencies
    ];
    
    elements.conversionsGrid.innerHTML = allCurrencies.map(currency => {
        const isBase = currency.code === state.baseCurrency;
        const rate = isBase ? 1 : (state.rates[currency.code] || 0);
        const converted = state.amount * rate;
        
        return `
            <div class="conversion-card ${state.isLoading ? 'loading' : ''} ${isBase ? 'same-currency' : ''}">
                <div class="card-header">
                    <span class="card-flag">${currency.flag}</span>
                    <div class="card-info">
                        <span class="card-code">${currency.code}</span>
                        <span class="card-name">${currency.name}</span>
                    </div>
                </div>
                <div class="card-value">${formatCurrency(converted, currency.code)}</div>
                ${!isBase ? `<div class="card-rate">1 ${state.baseCurrency} = ${formatRate(rate)} ${currency.code}</div>` : ''}
            </div>
        `;
    }).join('');
}

function formatCurrency(value, currencyCode) {
    if (isNaN(value) || value === 0) return '—';
    
    // Formattazione speciale per valute con molti zeri (es. VND)
    const decimals = ['VND', 'RUB'].includes(currencyCode) ? 0 : 2;
    
    return new Intl.NumberFormat('it-IT', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

function formatRate(rate) {
    if (rate >= 100) return rate.toFixed(2);
    if (rate >= 1) return rate.toFixed(4);
    return rate.toFixed(6);
}

function updateLastUpdateDisplay() {
    if (!state.lastUpdate) {
        elements.lastUpdate.textContent = 'Caricamento...';
        return;
    }
    
    const now = new Date();
    const diff = now - state.lastUpdate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    let timeText;
    if (minutes < 1) {
        timeText = 'adesso';
    } else if (minutes < 60) {
        timeText = `${minutes} min fa`;
    } else if (hours < 24) {
        timeText = `${hours}h fa`;
    } else {
        timeText = state.lastUpdate.toLocaleDateString('it-IT');
    }
    
    elements.lastUpdate.textContent = `Tassi aggiornati ${timeText}`;
    elements.lastUpdate.classList.remove('error');
}

// ═══════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════

function handleAmountInput(e) {
    // Permetti solo numeri e separatori decimali
    let value = e.target.value.replace(/[^\d.,]/g, '');
    
    // Normalizza il separatore decimale
    value = value.replace(',', '.');
    
    // Rimuovi punti multipli
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    e.target.value = value;
    state.amount = parseFloat(value) || 0;
    renderConversions();
}

function toggleCurrencyDropdown() {
    elements.baseCurrencySelector.classList.toggle('open');
}

function closeCurrencyDropdown() {
    elements.baseCurrencySelector.classList.remove('open');
}

function handleClickOutside(e) {
    if (!elements.baseCurrencySelector.contains(e.target)) {
        closeCurrencyDropdown();
    }
}

function handleRefresh() {
    loadRates(true);
}

// ═══════════════════════════════════════════════════════════════
// INIZIALIZZAZIONE
// ═══════════════════════════════════════════════════════════════

function init() {
    // Imposta valore iniziale
    elements.amountInput.value = state.amount;
    
    // Render iniziale
    renderCurrencyDropdown();
    updateBaseCurrencyDisplay();
    
    // Event listeners
    elements.amountInput.addEventListener('input', handleAmountInput);
    elements.baseCurrencyBtn.addEventListener('click', toggleCurrencyDropdown);
    elements.refreshBtn.addEventListener('click', handleRefresh);
    document.addEventListener('click', handleClickOutside);
    
    // Focus input on load (desktop only)
    if (window.innerWidth > 768) {
        elements.amountInput.focus();
        elements.amountInput.select();
    }
    
    // Carica tassi
    loadRates();
    
    // Aggiorna automaticamente ogni 4 ore
    setInterval(() => loadRates(true), CACHE_DURATION);
    
    // Aggiorna quando l'app torna in foreground
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            const cached = getCachedRates();
            if (!cached || Date.now() - cached.timestamp > 60 * 60 * 1000) {
                loadRates(true);
            }
        }
    });
}

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed:', err));
    });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
