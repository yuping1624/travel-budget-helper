/**
 * Budget Master - Main Application Logic
 */

// State
const state = {
    travelInfo: {
        startDate: '',
        endDate: '',
        location: '',
        budget: 0
    },
    settings: {
        currency: 'JPY',
        exchangeRate: 0.21, // Default example
        taxRate: 0, // Default 0%
        mode: 'cart', // 'cart' or 'direct'
        rateMode: 'manual' // 'api' or 'manual'
    },
    items: [],
    cartItems: [] // Staging area for cart mode
};

// UI State (Non-persistent)
const uiState = {
    cartActiveCategory: null,
    directActiveCategory: null,
    itemsExpanded: false, // Track if items list is expanded
    sectionsCollapsed: JSON.parse(localStorage.getItem('sectionsCollapsed') || '{}') // Track collapsed sections
};

// Debug helper
function logDebug(message) {
    if (typeof console !== 'undefined' && console.log) {
        console.log(message);
    }
}

// DOM Elements
const elements = {
    // Travel Info
    startDate: document.getElementById('start-date'),
    endDate: document.getElementById('end-date'),
    location: document.getElementById('location'),
    totalBudget: document.getElementById('total-budget'),
    editInfoBtn: document.getElementById('edit-info-btn'),
    saveInfoBtn: document.getElementById('save-info-btn'),
    travelInfoInputs: [
        document.getElementById('start-date'),
        document.getElementById('end-date'),
        document.getElementById('location'),
        document.getElementById('total-budget')
    ],

    // Settings
    currencySelect: document.getElementById('currency-select'),
    exchangeRateInput: document.getElementById('exchange-rate-input'),
    taxRateInput: document.getElementById('tax-rate-input'),
    fetchRateBtn: document.getElementById('fetch-rate-btn'),
    rateApiBtn: document.getElementById('rate-api-btn'),
    rateManualBtn: document.getElementById('rate-manual-btn'),

    // Mode Switchers
    modeCartBtn: document.getElementById('mode-cart-btn'),
    modeDirectBtn: document.getElementById('mode-direct-btn'),
    cartInputPanel: document.getElementById('cart-input-panel'),
    directInputPanel: document.getElementById('direct-input-panel'),
    cartStagingArea: document.getElementById('cart-staging-area'),

    // Item Inputs
    itemPrice: document.getElementById('item-price'),
    itemQuantity: document.getElementById('item-quantity'),
    cartTaxToggle: document.getElementById('cart-tax-toggle'),
    cartTwdPreview: document.getElementById('cart-twd-preview'),
    addItemBtn: document.getElementById('add-item-btn'),

    // Cart Staging
    cartItemsList: document.getElementById('cart-items-list'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartCount: document.getElementById('cart-count'),
    checkoutBtn: document.getElementById('checkout-btn'),

    // Direct Inputs
    categoryBtns: document.querySelectorAll('.category-btn'),
    directPrice: document.getElementById('direct-price'),
    directTaxToggle: document.getElementById('direct-tax-toggle'),
    directTwdPreview: document.getElementById('direct-twd-preview'),
    addExpenseBtn: document.getElementById('add-expense-btn'),

    // Display
    itemsList: document.getElementById('items-list'),
    showMoreBtn: document.getElementById('show-more-btn'),
    totalSpent: document.getElementById('total-spent'),
    remainingBudget: document.getElementById('remaining-budget'),
    budgetWarning: document.getElementById('budget-warning'),

    // Modal
    modal: document.getElementById('custom-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalCancelBtn: document.getElementById('modal-cancel-btn'),
    modalConfirmBtn: document.getElementById('modal-confirm-btn')
};

// Modal Helper
function showModal(title, message, isConfirm = false) {
    return new Promise((resolve) => {
        elements.modalTitle.textContent = title;
        elements.modalMessage.textContent = message;

        elements.modal.classList.remove('hidden');

        if (isConfirm) {
            elements.modalCancelBtn.classList.remove('hidden');
        } else {
            elements.modalCancelBtn.classList.add('hidden');
        }

        const handleConfirm = () => {
            closeModal();
            resolve(true);
        };

        const handleCancel = () => {
            closeModal();
            resolve(false);
        };

        // Remove old listeners to prevent duplicates (simple approach)
        const newConfirmBtn = elements.modalConfirmBtn.cloneNode(true);
        elements.modalConfirmBtn.parentNode.replaceChild(newConfirmBtn, elements.modalConfirmBtn);
        elements.modalConfirmBtn = newConfirmBtn;

        const newCancelBtn = elements.modalCancelBtn.cloneNode(true);
        elements.modalCancelBtn.parentNode.replaceChild(newCancelBtn, elements.modalCancelBtn);
        elements.modalCancelBtn = newCancelBtn;

        elements.modalConfirmBtn.addEventListener('click', handleConfirm);
        elements.modalCancelBtn.addEventListener('click', handleCancel);
    });
}

function closeModal() {
    elements.modal.classList.add('hidden');
}

// Toggle collapsible sections
function toggleSection(contentId) {
    const content = document.getElementById(contentId);
    const chevronId = contentId.replace('-content', '-chevron');
    const chevron = document.getElementById(chevronId);

    if (!content) return;

    const isCollapsed = content.classList.contains('collapsed');

    if (isCollapsed) {
        // Expand
        content.classList.remove('collapsed');
        if (chevron) chevron.classList.remove('chevron-rotated');
        uiState.sectionsCollapsed[contentId] = false;
    } else {
        // Collapse
        content.classList.add('collapsed');
        if (chevron) chevron.classList.add('chevron-rotated');
        uiState.sectionsCollapsed[contentId] = true;
    }

    // Save state
    localStorage.setItem('sectionsCollapsed', JSON.stringify(uiState.sectionsCollapsed));
}

// Expose to global scope for onclick
window.toggleSection = toggleSection;

// Initialization
function init() {
    console.log('Budget Master Initialized');
    loadData();
    setupEventListeners();
    restoreCollapsedStates();
    render();
}

// Restore collapsed section states
function restoreCollapsedStates() {
    Object.keys(uiState.sectionsCollapsed).forEach(contentId => {
        if (uiState.sectionsCollapsed[contentId]) {
            const content = document.getElementById(contentId);
            const chevronId = contentId.replace('-content', '-chevron');
            const chevron = document.getElementById(chevronId);

            if (content) {
                content.classList.add('collapsed');
                if (chevron) chevron.classList.add('chevron-rotated');
            }
        }
    });
}

function loadData() {
    const savedState = localStorage.getItem('budgetMasterState');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        Object.assign(state, parsed);

        // Ensure rateMode exists for backward compatibility
        if (!state.settings.rateMode) {
            state.settings.rateMode = 'manual';
        }

        // Ensure exchangeRate is valid (not 0 or undefined)
        if (!state.settings.exchangeRate || state.settings.exchangeRate === 0) {
            state.settings.exchangeRate = 0.21; // Default fallback
        }

        // Restore inputs
        elements.startDate.value = state.travelInfo.startDate;
        elements.endDate.value = state.travelInfo.endDate;
        elements.location.value = state.travelInfo.location;
        elements.totalBudget.value = state.travelInfo.budget || '';
        elements.currencySelect.value = state.settings.currency;
        elements.exchangeRateInput.value = state.settings.exchangeRate;
        elements.taxRateInput.value = state.settings.taxRate;

        // Restore cart items if any
        if (parsed.cartItems) {
            state.cartItems = parsed.cartItems;
        }
    } else {
        // No saved data - ensure input fields have default values
        elements.exchangeRateInput.value = state.settings.exchangeRate;
        elements.taxRateInput.value = state.settings.taxRate;
    }
}

function saveData() {
    localStorage.setItem('budgetMasterState', JSON.stringify(state));
}

function toggleTravelInfoEdit(isEditing) {
    elements.travelInfoInputs.forEach(input => {
        input.disabled = !isEditing;
        // Update classes based on editing state
        if (isEditing) {
            // Enable editing - remove disabled styles, add normal styles
            input.classList.remove('disabled:bg-gray-50', 'disabled:text-gray-500');
            input.classList.add('bg-white', 'text-gray-800');
        } else {
            // Disable editing - add disabled styles, remove normal styles
            input.classList.add('disabled:bg-gray-50', 'disabled:text-gray-500');
            input.classList.remove('bg-white', 'text-gray-800');
        }
    });

    if (isEditing) {
        elements.editInfoBtn.classList.add('hidden');
        elements.saveInfoBtn.classList.remove('hidden');
    } else {
        elements.editInfoBtn.classList.remove('hidden');
        elements.saveInfoBtn.classList.add('hidden');
    }
}

function switchRateMode(mode) {
    state.settings.rateMode = mode;

    if (mode === 'api') {
        elements.rateApiBtn.classList.add('bg-white', 'shadow-sm', 'text-primary', 'font-medium');
        elements.rateApiBtn.classList.remove('text-gray-500');
        elements.rateManualBtn.classList.remove('bg-white', 'shadow-sm', 'text-primary', 'font-medium');
        elements.rateManualBtn.classList.add('text-gray-500');

        elements.exchangeRateInput.disabled = true;
        elements.fetchRateBtn.disabled = false;
        elements.fetchRateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        elements.rateManualBtn.classList.add('bg-white', 'shadow-sm', 'text-primary', 'font-medium');
        elements.rateManualBtn.classList.remove('text-gray-500');
        elements.rateApiBtn.classList.remove('bg-white', 'shadow-sm', 'text-primary', 'font-medium');
        elements.rateApiBtn.classList.add('text-gray-500');

        elements.exchangeRateInput.disabled = false;
        elements.fetchRateBtn.disabled = true;
        elements.fetchRateBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    saveData();
}

function setupEventListeners() {
    // Travel Info Events
    elements.editInfoBtn.addEventListener('click', () => toggleTravelInfoEdit(true));
    elements.saveInfoBtn.addEventListener('click', () => {
        state.travelInfo.startDate = elements.startDate.value;
        state.travelInfo.endDate = elements.endDate.value;
        state.travelInfo.location = elements.location.value;
        state.travelInfo.budget = parseFloat(elements.totalBudget.value) || 0;
        saveData();
        toggleTravelInfoEdit(false);
        render(); // Re-render to update budget display
    });

    elements.startDate.addEventListener('change', () => { state.travelInfo.startDate = elements.startDate.value; saveData(); });
    elements.endDate.addEventListener('change', () => { state.travelInfo.endDate = elements.endDate.value; saveData(); });
    elements.location.addEventListener('input', () => { state.travelInfo.location = elements.location.value; saveData(); });
    elements.totalBudget.addEventListener('input', () => {
        state.travelInfo.budget = parseFloat(elements.totalBudget.value) || 0;
        saveData();
        render(); // This will call updateBudgetDisplay internally
    });

    // Settings Events
    elements.currencySelect.addEventListener('change', () => {
        state.settings.currency = elements.currencySelect.value;
        saveData();
        if (state.settings.rateMode === 'api') {
            fetchExchangeRate();
        }
    });

    elements.rateApiBtn.addEventListener('click', () => switchRateMode('api'));
    elements.rateManualBtn.addEventListener('click', () => switchRateMode('manual'));

    elements.fetchRateBtn.addEventListener('click', (e) => { e.preventDefault(); fetchExchangeRate(); });

    elements.exchangeRateInput.addEventListener('input', () => {
        if (state.settings.rateMode === 'manual') {
            state.settings.exchangeRate = parseFloat(elements.exchangeRateInput.value) || 0;
            saveData();
            updateCartTwdPreview();
            updateDirectTwdPreview();
        }
    });

    elements.taxRateInput.addEventListener('input', () => {
        state.settings.taxRate = parseFloat(elements.taxRateInput.value) || 0;
        saveData();
        updateCartTwdPreview();
        updateDirectTwdPreview();
    });

    // Mode Switch
    elements.modeCartBtn.addEventListener('click', () => switchMode('cart'));
    elements.modeDirectBtn.addEventListener('click', () => switchMode('direct'));

    // TWD Preview Listeners
    [elements.itemPrice, elements.itemQuantity, elements.cartTaxToggle].forEach(el => {
        el.addEventListener('input', updateCartTwdPreview);
        el.addEventListener('change', updateCartTwdPreview);
    });

    [elements.directPrice, elements.directTaxToggle].forEach(el => {
        el.addEventListener('input', updateDirectTwdPreview);
        el.addEventListener('change', updateDirectTwdPreview);
    });

    // Category Selection (Event Delegation)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (!btn) return;

        e.preventDefault();
        logDebug(`Clicked category: ${btn.dataset.category}`);

        const panel = btn.closest('#cart-input-panel') || btn.closest('#direct-input-panel');
        if (panel) {
            panel.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            logDebug(`Set active: ${btn.dataset.category} in panel ${panel.id}`);

            // Trigger input event on price/quantity to update preview if needed
            if (panel.id === 'cart-input-panel') updateCartTwdPreview();
            if (panel.id === 'direct-input-panel') updateDirectTwdPreview();
        } else {
            logDebug('No panel found for button');
        }
    });

    // Add Item Button
    elements.addItemBtn.addEventListener('click', (e) => { e.preventDefault(); addItemFromCart(); });

    // Checkout Cart
    elements.checkoutBtn.addEventListener('click', (e) => { e.preventDefault(); checkoutCart(); });

    // Show More/Less button - improved version
    elements.showMoreBtn.addEventListener('click', () => {
        const wasExpanded = uiState.itemsExpanded;
        uiState.itemsExpanded = !uiState.itemsExpanded;

        if (wasExpanded && !uiState.itemsExpanded) {
            // Collapsing: smooth scroll to show button position, then collapse
            const items = Array.from(elements.itemsList.children);
            const maxVisible = 5;

            // Mark items for fade out
            items.slice(maxVisible).forEach(item => {
                item.classList.add('item-fade-out');
            });

            // Scroll to make the 5th item and show button visible
            setTimeout(() => {
                if (items[4]) {
                    items[4].scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                    });
                }
            }, 50);

            // Wait for scroll and animation, then re-render
            setTimeout(() => {
                renderItems();
            }, 400);
        } else if (!wasExpanded && uiState.itemsExpanded) {
            // Expanding: re-render then scroll to show new items
            const oldScrollY = window.scrollY;
            renderItems();

            // Restore scroll position briefly
            window.scrollTo(0, oldScrollY);

            // Then smoothly scroll to reveal 6th item
            setTimeout(() => {
                const items = elements.itemsList.children;
                if (items.length > 5) {
                    items[5].scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
        } else {
            renderItems();
        }
    });
}

async function fetchExchangeRate() {
    const currency = state.settings.currency;
    const btn = document.getElementById('fetch-rate-btn');
    const originalText = btn.textContent;

    btn.textContent = '更新中...';
    btn.disabled = true;

    try {
        // Using a free API (ExchangeRate-API)
        // We want 1 Foreign Currency = ? TWD
        // So we fetch base = Currency
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const data = await response.json();

        if (data && data.rates && data.rates.TWD) {
            const rate = data.rates.TWD;
            state.settings.exchangeRate = rate;
            elements.exchangeRateInput.value = rate;
            elements.exchangeRateInput.value = rate;
            saveData();
            updateCartTwdPreview();
            updateDirectTwdPreview();
            showModal('成功', `已更新匯率：1 ${currency} = ${rate} TWD`);
        } else {
            throw new Error('無法取得匯率');
        }
    } catch (error) {
        console.error(error);
        showModal('錯誤', '匯率更新失敗，請檢查網路或稍後再試');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function switchMode(mode) {
    state.settings.mode = mode;
    if (mode === 'cart') {
        elements.modeCartBtn.classList.add('text-primary', 'border-b-2', 'border-primary');
        elements.modeCartBtn.classList.remove('text-gray-500');
        elements.modeDirectBtn.classList.remove('text-primary', 'border-b-2', 'border-primary');
        elements.modeDirectBtn.classList.add('text-gray-500');

        elements.cartInputPanel.classList.remove('hidden');
        elements.cartStagingArea.classList.remove('hidden'); // Show staging
        elements.directInputPanel.classList.add('hidden');
    } else {
        elements.modeDirectBtn.classList.add('text-primary', 'border-b-2', 'border-primary');
        elements.modeDirectBtn.classList.remove('text-gray-500');
        elements.modeCartBtn.classList.remove('text-primary', 'border-b-2', 'border-primary');
        elements.modeCartBtn.classList.add('text-gray-500');

        elements.directInputPanel.classList.remove('hidden');
        elements.cartInputPanel.classList.add('hidden');
        elements.cartStagingArea.classList.add('hidden'); // Hide staging
    }
    saveData();
}

function updateCartTwdPreview() {
    const price = parseFloat(elements.itemPrice.value) || 0;
    const quantity = parseInt(elements.itemQuantity.value) || 1;
    // Read exchange rate from input field to get the most current value
    const exchangeRate = parseFloat(elements.exchangeRateInput.value) || state.settings.exchangeRate || 0;
    const applyTax = elements.cartTaxToggle.checked;
    const taxRate = applyTax ? (parseFloat(elements.taxRateInput.value) || state.settings.taxRate || 0) : 0;

    const total = Math.round(price * quantity * exchangeRate * (1 + taxRate / 100));
    elements.cartTwdPreview.textContent = `NT$ ${total}`;
}

function updateDirectTwdPreview() {
    const price = parseFloat(elements.directPrice.value) || 0;
    // Read exchange rate from input field to get the most current value
    const exchangeRate = parseFloat(elements.exchangeRateInput.value) || state.settings.exchangeRate || 0;
    const applyTax = elements.directTaxToggle.checked;
    const taxRate = applyTax ? (parseFloat(elements.taxRateInput.value) || state.settings.taxRate || 0) : 0;

    const total = Math.round(price * exchangeRate * (1 + taxRate / 100));
    elements.directTwdPreview.textContent = `NT$ ${total}`;
}

function addItemFromCart() {
    logDebug('addItemFromCart called');
    // Get active category from Cart panel
    const activeCategoryBtn = document.querySelector('#cart-input-panel .category-btn.active');
    const price = parseFloat(elements.itemPrice.value);
    const quantity = parseInt(elements.itemQuantity.value);

    if (!activeCategoryBtn) logDebug('No active category button found');
    if (isNaN(price)) logDebug('Invalid price');
    if (isNaN(quantity)) logDebug('Invalid quantity');

    if (!activeCategoryBtn || isNaN(price) || isNaN(quantity)) {
        showModal('提示', '請選擇商品類別並輸入價格與數量');
        return;
    }

    const category = activeCategoryBtn.dataset.category;
    const categoryIcon = activeCategoryBtn.querySelector('span').textContent;
    const categoryName = activeCategoryBtn.querySelector('.text-xs').textContent;

    // Check tax toggle
    const applyTax = elements.cartTaxToggle.checked;
    const taxRate = applyTax ? state.settings.taxRate : 0;

    const item = {
        id: Date.now(),
        type: 'cart',
        name: categoryName, // Use category name as item name
        category: category,
        icon: categoryIcon,
        price,
        quantity,
        currency: state.settings.currency,
        exchangeRate: state.settings.exchangeRate,
        taxRate: taxRate,
        timestamp: new Date().toISOString()
    };

    state.cartItems.unshift(item); // Add to staging
    saveData();
    renderCart(); // Render staging area

    // Reset inputs
    // Remove active class from buttons
    document.querySelectorAll('#cart-input-panel .category-btn').forEach(btn => btn.classList.remove('active'));
    elements.itemPrice.value = '';
    elements.itemQuantity.value = '1';
}

function addExpenseFromDirect() {
    const price = parseFloat(elements.directPrice.value);
    const activeCategoryBtn = document.querySelector('.category-btn.active');

    if (isNaN(price) || !activeCategoryBtn) {
        showModal('提示', '請選擇類別並輸入金額');
        return;
    }

    const category = activeCategoryBtn.dataset.category;
    const categoryIcon = activeCategoryBtn.querySelector('span').textContent;

    // Check tax toggle
    const applyTax = elements.directTaxToggle.checked;
    const taxRate = applyTax ? state.settings.taxRate : 0;

    const item = {
        id: Date.now(),
        type: 'direct',
        category,
        icon: categoryIcon,
        price,
        currency: state.settings.currency,
        exchangeRate: state.settings.exchangeRate,
        taxRate: taxRate,
        timestamp: new Date().toISOString()
    };

    state.items.unshift(item);
    saveData();
    render();

    // Reset inputs
    elements.directPrice.value = '';
}

function render() {
    renderItems();
    renderCart();
    updateBudgetDisplay();
    switchMode(state.settings.mode);
    // Initialize rate mode UI if it exists
    if (state.settings.rateMode) {
        switchRateMode(state.settings.rateMode);
    }
    // Update previews after render
    updateCartTwdPreview();
    updateDirectTwdPreview();
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';

        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // Show relative time for recent items
        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                return diffMinutes <= 1 ? '剛剛' : `${diffMinutes} 分鐘前`;
            }
            return diffHours === 1 ? '1 小時前' : `${diffHours} 小時前`;
        } else if (diffDays === 1) {
            return '昨天';
        } else if (diffDays < 7) {
            return `${diffDays} 天前`;
        }

        // For older items, show absolute date
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}`;
    } catch (e) {
        return '';
    }
}

function renderItems() {
    elements.itemsList.innerHTML = '';

    if (state.items.length === 0) {
        elements.itemsList.innerHTML = '<div class="text-center text-gray-400 py-8 text-sm">尚未新增任何項目</div>';
        elements.showMoreBtn.classList.add('hidden');
        return;
    }

    // Determine how many items to show
    const maxVisible = 5;
    const shouldShowMore = state.items.length > maxVisible;
    const itemsToShow = uiState.itemsExpanded ? state.items : state.items.slice(0, maxVisible);

    itemsToShow.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center';

        const totalTWD = Math.round(item.price * item.exchangeRate * (1 + item.taxRate / 100) * (item.quantity || 1));
        const dateStr = formatDate(item.timestamp);

        let iconHtml = '';
        let titleHtml = '';
        let descHtml = '';

        if (item.type === 'cart') {
            iconHtml = `<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">${item.icon || '🛒'}</div>`;
            titleHtml = `<div class="font-medium text-gray-800">${item.name}</div>`;
            descHtml = `<div class="text-xs text-gray-500">${item.currency} ${item.price} x ${item.quantity}</div>`;
        } else {
            iconHtml = `<div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">${item.icon || '💰'}</div>`;
            titleHtml = `<div class="font-medium text-gray-800">${getCategoryName(item.category)}</div>`;
            descHtml = `<div class="text-xs text-gray-500">${item.currency} ${item.price}</div>`;
        }

        itemEl.innerHTML = `
            <div class="flex items-center space-x-3 flex-1">
                ${iconHtml}
                <div class="flex-1">
                    ${titleHtml}
                    ${descHtml}
                    ${dateStr ? `<div class="text-xs text-gray-400 mt-0.5">${dateStr}</div>` : ''}
                </div>
            </div>
            <div class="text-right ml-3">
                <div class="font-bold text-gray-800">NT$ ${totalTWD}</div>
                <button class="text-xs text-red-400 hover:text-red-600 mt-1" onclick="deleteItem(${item.id})">刪除</button>
            </div>
        `;
        elements.itemsList.appendChild(itemEl);
    });

    // Show/hide "Show More" button
    if (shouldShowMore) {
        elements.showMoreBtn.classList.remove('hidden');
        elements.showMoreBtn.textContent = uiState.itemsExpanded ? '顯示較少...' : `顯示更多... (${state.items.length - maxVisible} 筆)`;
    } else {
        elements.showMoreBtn.classList.add('hidden');
    }

    // Update statistics
    updateStatistics();
}

// Update statistics display
function updateStatistics() {
    const statsSection = document.getElementById('stats-section');
    const dailyAverageEl = document.getElementById('daily-average');
    const topCategoryEl = document.getElementById('top-category');

    if (state.items.length === 0) {
        statsSection.classList.add('hidden');
        return;
    }

    statsSection.classList.remove('hidden');

    // Calculate daily average
    const totalSpent = state.items.reduce((acc, item) => {
        return acc + (item.price * item.exchangeRate * (1 + item.taxRate / 100) * (item.quantity || 1));
    }, 0);

    // Calculate days in trip
    let dayCount = 1;
    if (state.travelInfo.startDate && state.travelInfo.endDate) {
        const start = new Date(state.travelInfo.startDate);
        const end = new Date(state.travelInfo.endDate);
        dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    }

    const dailyAvg = Math.round(totalSpent / dayCount);
    dailyAverageEl.textContent = `NT$ ${dailyAvg}`;

    // Calculate top category
    const categoryTotals = {};
    state.items.forEach(item => {
        const category = item.category || 'other';
        const amount = item.price * item.exchangeRate * (1 + item.taxRate / 100) * (item.quantity || 1);
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    let topCategory = 'other';
    let topAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
        if (amount > topAmount) {
            topAmount = amount;
            topCategory = cat;
        }
    });

    const categoryName = getCategoryName(topCategory);
    topCategoryEl.textContent = `${categoryName} NT$ ${Math.round(topAmount)}`;
}

function getCategoryName(cat) {
    const map = {
        'food': '飲食',
        'groceries': '食材',
        'daily': '日用品',
        'transport': '交通',
        'entertainment': '娛樂',
        'shopping': '娛樂', // Backward compatibility
        'accommodation': '住宿',
        'flight': '機票',
        'other': '其他'
    };
    return map[cat] || '消費';
}

async function deleteItem(id) {
    const confirmed = await showModal('確認刪除', '確定要刪除此項目嗎？', true);
    if (confirmed) {
        state.items = state.items.filter(i => i.id !== id);
        saveData();
        render();
    }
}
// Expose deleteItem to global scope for onclick
window.deleteItem = deleteItem;

function updateBudgetDisplay() {
    const totalSpent = state.items.reduce((acc, item) => {
        return acc + (item.price * item.exchangeRate * (1 + item.taxRate / 100) * (item.quantity || 1));
    }, 0);

    const remaining = state.travelInfo.budget - totalSpent;

    elements.totalSpent.textContent = `NT$ ${Math.round(totalSpent)}`;
    elements.remainingBudget.textContent = `NT$ ${Math.round(remaining)}`;

    if (remaining < 0) {
        elements.remainingBudget.classList.remove('text-success');
        elements.remainingBudget.classList.add('text-danger');
        elements.budgetWarning.classList.remove('hidden');
    } else {
        elements.remainingBudget.classList.add('text-success');
        elements.remainingBudget.classList.remove('text-danger');
        elements.budgetWarning.classList.add('hidden');
    }
}

// Checkout Cart
elements.checkoutBtn.addEventListener('click', checkoutCart);

function renderCart() {
    elements.cartItemsList.innerHTML = '';

    if (state.cartItems.length === 0) {
        elements.cartItemsList.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">購物車是空的</div>';
        elements.cartSubtotal.textContent = 'NT$ 0';
        elements.cartCount.textContent = '(0)';
        return;
    }

    let subtotal = 0;

    state.cartItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'bg-gray-50 p-2 rounded border border-gray-100 flex justify-between items-center text-sm';

        const totalTWD = Math.round(item.price * item.exchangeRate * (1 + item.taxRate / 100) * (item.quantity || 1));
        subtotal += totalTWD;

        itemEl.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center border text-lg">${item.icon || '🛒'}</div>
                <div>
                    <div class="font-medium text-gray-700">${item.name}</div>
                    <div class="text-xs text-gray-400">${item.currency} ${item.price} x ${item.quantity}</div>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <div class="font-bold text-gray-700">NT$ ${totalTWD}</div>
                <button class="text-red-400 hover:text-red-600" onclick="deleteCartItem(${item.id})">✕</button>
            </div>
        `;
        elements.cartItemsList.appendChild(itemEl);
    });

    elements.cartSubtotal.textContent = `NT$ ${subtotal}`;
    elements.cartCount.textContent = `(${state.cartItems.length})`;
}

async function checkoutCart() {
    if (state.cartItems.length === 0) {
        showModal('提示', '購物車是空的');
        return;
    }

    const confirmed = await showModal('確認結帳', `確定要結帳 ${state.cartItems.length} 個項目嗎？`, true);
    if (confirmed) {
        // Move items from cart to main list
        state.items = [...state.cartItems, ...state.items];
        state.cartItems = [];

        saveData();
        render();
        showModal('成功', '結帳完成！');
    }
}

function deleteCartItem(id) {
    state.cartItems = state.cartItems.filter(i => i.id !== id);
    saveData();
    renderCart();
}
// Expose functions to global scope
window.addItemFromCart = addItemFromCart;
window.addExpenseFromDirect = addExpenseFromDirect;
window.deleteItem = deleteItem;
window.deleteCartItem = deleteCartItem;
window.checkoutCart = checkoutCart;

// Run init
init();
