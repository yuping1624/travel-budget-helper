/**
 * Pocket Trip - Main Application Logic
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
        rateMode: 'manual', // 'api' or 'manual'
        language: localStorage.getItem('language') || 'zh' // 'zh' or 'en'
    },
    items: [],
    cartItems: [] // Staging area for cart mode
};

// Translation object
const translations = {
    zh: {
        'header-title': '旅費隨記',
        'lang-display': '中文',
        'travel-info': '旅程資訊',
        'edit': '編輯',
        'save': '儲存',
        'start-date': '開始日期',
        'end-date': '結束日期',
        'location': '地點',
        'location-placeholder': '例如：東京',
        'total-budget': '總預算 (TWD)',
        'exchange-rate': '匯率設定',
        'currency': '幣別',
        'rate-label': '匯率 (1 外幣 = ? 台幣)',
        'update-rate': '更新匯率',
        'updating': '更新中...',
        'tax-rate': '稅率 (%)',
        'rate-mode-realtime': '即時',
        'rate-mode-manual': '手動',
        'cart-mode': '🛒 購物車模式',
        'direct-mode': '📝 直接記帳',
        'amount-foreign': '金額 (外幣)',
        'quantity': '數量',
        'include-tax': '含稅計算',
        'preview': '預估',
        'add-to-cart': '加入購物車',
        'confirm-expense': '確認記帳',
        'cart-list': '🛒 購物車清單',
        'subtotal': '小計 (預估)',
        'checkout': '確認結帳',
        'stats-overview': '消費概覽',
        'daily-average': '平均每日',
        'top-expense': '最大開支',
        'expense-details': '消費明細',
        'no-items': '尚未新增任何項目',
        'show-more': '顯示更多...',
        'show-less': '顯示較少...',
        'budget-usage': '預算使用',
        'budget': '預算',
        'total-spent': '總花費',
        'remaining': '剩餘預算',
        'budget-warning': '⚠️ 已超支！請注意控制預算，再買就要剁手手',
        'success': '成功',
        'error': '錯誤',
        'confirm': '確定',
        'cancel': '取消',
        'rate-updated': '已更新匯率',
        'rate-update-failed': '匯率更新失敗，請檢查網路或稍後再試',
        'select-category-price': '請選擇商品類別並輸入價格與數量',
        'select-category-amount': '請選擇類別並輸入金額',
        'cart-empty': '購物車是空的',
        'confirm-delete': '確認刪除',
        'confirm-delete-msg': '確定要刪除此項目嗎？',
        'confirm-checkout': '確認結帳',
        'confirm-checkout-msg': '確定要結帳',
        'items': '個項目',
        'checkout-success': '結帳完成！',
        'tip': '提示',
        'category-food': '飲食',
        'category-groceries': '食材',
        'category-daily': '日用品',
        'category-transport': '交通',
        'category-entertainment': '娛樂',
        'category-accommodation': '住宿',
        'category-flight': '機票',
        'category-other': '其他',
        'expense': '消費',
        'currency-twd': '台幣',
        'currency-jpy': '日幣',
        'currency-usd': '美金',
        'currency-eur': '歐元',
        'currency-gbp': '英鎊',
        'currency-aud': '澳幣',
        'currency-thb': '泰銖',
        'currency-cny': '人民幣',
        'currency-krw': '韓元',
        'currency-cad': '加幣',
        'just-now': '剛剛',
        'minutes-ago': '分鐘前',
        'hours-ago': '小時前',
        'hour-ago': '小時前'
    },
    en: {
        'header-title': 'Pocket Trip',
        'lang-display': 'EN',
        'travel-info': 'Travel Info',
        'edit': 'Edit',
        'save': 'Save',
        'start-date': 'Start Date',
        'end-date': 'End Date',
        'location': 'Location',
        'location-placeholder': 'e.g., Tokyo',
        'total-budget': 'Total Budget (TWD)',
        'exchange-rate': 'Exchange Rate',
        'currency': 'Currency',
        'rate-label': 'Rate (1 Foreign = ? TWD)',
        'update-rate': 'Update Rate',
        'updating': 'Updating...',
        'tax-rate': 'Tax Rate (%)',
        'rate-mode-realtime': 'Realtime',
        'rate-mode-manual': 'Manual',
        'cart-mode': '🛒 Cart Mode',
        'direct-mode': '📝 Direct Entry',
        'amount-foreign': 'Amount (Foreign)',
        'quantity': 'Quantity',
        'include-tax': 'Include Tax',
        'preview': 'Estimate',
        'add-to-cart': 'Add to Cart',
        'confirm-expense': 'Confirm Entry',
        'cart-list': '🛒 Cart List',
        'subtotal': 'Subtotal (Est.)',
        'checkout': 'Checkout',
        'stats-overview': 'Expense Overview',
        'daily-average': 'Daily Average',
        'top-expense': 'Top Expense',
        'expense-details': 'Expense Details',
        'no-items': 'No items yet',
        'show-more': 'Show More...',
        'show-less': 'Show Less...',
        'budget-usage': 'Budget Usage',
        'budget': 'Budget',
        'total-spent': 'Total Spent',
        'remaining': 'Remaining',
        'budget-warning': '⚠️ Over Budget! Please control your spending',
        'success': 'Success',
        'error': 'Error',
        'confirm': 'Confirm',
        'cancel': 'Cancel',
        'rate-updated': 'Rate updated',
        'rate-update-failed': 'Failed to update rate, please check network or try again',
        'select-category-price': 'Please select category and enter price & quantity',
        'select-category-amount': 'Please select category and enter amount',
        'cart-empty': 'Cart is empty',
        'confirm-delete': 'Confirm Delete',
        'confirm-delete-msg': 'Are you sure you want to delete this item?',
        'confirm-checkout': 'Confirm Checkout',
        'confirm-checkout-msg': 'Are you sure you want to checkout',
        'items': 'items',
        'checkout-success': 'Checkout completed!',
        'tip': 'Tip',
        'category-food': 'Food',
        'category-groceries': 'Groceries',
        'category-daily': 'Daily',
        'category-transport': 'Transport',
        'category-entertainment': 'Entertainment',
        'category-accommodation': 'Stay',
        'category-flight': 'Flight',
        'category-other': 'Other',
        'expense': 'Expense',
        'currency-twd': 'TWD',
        'currency-jpy': 'JPY',
        'currency-usd': 'USD',
        'currency-eur': 'EUR',
        'currency-gbp': 'GBP',
        'currency-aud': 'AUD',
        'currency-thb': 'THB',
        'currency-cny': 'CNY',
        'currency-krw': 'KRW',
        'currency-cad': 'CAD',
        'just-now': 'Just now',
        'minutes-ago': 'minutes ago',
        'hours-ago': 'hours ago',
        'hour-ago': 'hour ago'
    }
};

// Get translation
function t(key) {
    return translations[state.settings.language][key] || key;
}

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

// Simple Modal Helper
let currentTriggerElement = null;

function positionModalNearElement(triggerElement) {
    if (!triggerElement) {
        console.warn('No trigger element provided for modal positioning');
        return;
    }

    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;

    // Verify trigger element is valid
    if (!triggerElement.isConnected) {
        console.warn('Trigger element is not connected to DOM');
        return;
    }

    // Get trigger element position relative to viewport (getBoundingClientRect already accounts for scroll)
    const triggerRect = triggerElement.getBoundingClientRect();

    // Debug: Log trigger element info
    console.log('Positioning modal near:', {
        id: triggerElement.id || 'no-id',
        text: triggerElement.textContent?.trim().substring(0, 30) || 'no-text',
        top: Math.round(triggerRect.top),
        bottom: Math.round(triggerRect.bottom),
        left: Math.round(triggerRect.left),
        right: Math.round(triggerRect.right),
        scrollY: window.scrollY
    });

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const padding = 16;
    const spacing = 12;

    // Get modal dimensions (it should be visible for measurement)
    let modalHeight = modalContent.offsetHeight || 200;
    const modalWidth = modalContent.offsetWidth || 384; // max-w-sm default

    // Limit modal height to ensure it can fit near the button
    const maxModalHeight = viewportHeight - padding * 2 - spacing * 2;
    if (modalHeight > maxModalHeight) {
        modalHeight = maxModalHeight;
        modalContent.style.maxHeight = `${maxModalHeight}px`;
        modalContent.style.overflowY = 'auto';
    }

    // Calculate vertical position - ALWAYS prioritize being near the button
    const spaceBelow = viewportHeight - triggerRect.bottom - spacing;
    const spaceAbove = triggerRect.top - spacing;

    let top;

    // Simple strategy: Always position relative to button, never center
    // Try below first (preferred)
    if (spaceBelow >= modalHeight) {
        // Fits perfectly below
        top = triggerRect.bottom + spacing;
    } else if (spaceAbove >= modalHeight) {
        // Fits perfectly above
        top = triggerRect.top - modalHeight - spacing;
    } else {
        // Doesn't fit perfectly above or below
        // Fallback to centering in viewport to ensure best visibility
        top = (viewportHeight - modalHeight) / 2;
    }

    // Final safety clamp - ensure at least part of modal is visible
    // Respect padding to avoid touching edges
    top = Math.max(padding, Math.min(top, viewportHeight - modalHeight - padding));

    // Calculate horizontal position (center, but ensure it fits)
    const left = Math.max(padding, Math.min((viewportWidth - modalWidth) / 2, viewportWidth - modalWidth - padding));

    // CRITICAL FIX: Use fixed positioning directly on modal-content
    // This positions it relative to viewport, not parent
    // We ensure parent has no transform that would break this
    const modalParent = modalContent.parentElement;

    // CRITICAL: Ensure parent has NO transform - this breaks fixed positioning
    if (modalParent) {
        // Force remove transform from parent - this is THE KEY to fixing fixed positioning
        modalParent.style.setProperty('transform', 'none', 'important');
        modalParent.style.setProperty('position', 'fixed', 'important');
        modalParent.style.setProperty('top', '0', 'important');
        modalParent.style.setProperty('left', '0', 'important');
        modalParent.style.setProperty('width', '100%', 'important');
        modalParent.style.setProperty('height', '100%', 'important');
        modalParent.style.setProperty('margin', '0', 'important');
        modalParent.style.setProperty('padding', '0', 'important');

        // Also remove any transform classes from parent
        modalParent.classList.remove('transform', 'transition-all');

        // Set parent to use flexbox for centering
        modalParent.style.setProperty('display', 'flex', 'important');
        modalParent.style.setProperty('align-items', 'flex-start', 'important');
        modalParent.style.setProperty('justify-content', 'center', 'important');

        // Force a reflow to ensure parent styles are applied
        void modalParent.offsetHeight;
    }

    // Use absolute positioning relative to fixed parent (which covers viewport)
    // This works even if ancestor elements have transform
    modalContent.style.setProperty('position', 'absolute', 'important');
    modalContent.style.setProperty('top', `${top}px`, 'important');
    modalContent.style.setProperty('left', `${left}px`, 'important');
    modalContent.style.setProperty('transform', 'none', 'important');
    modalContent.style.setProperty('margin', '0', 'important');
    modalContent.style.setProperty('width', `${Math.min(modalWidth, viewportWidth - padding * 2)}px`, 'important');
    modalContent.style.setProperty('max-width', '24rem', 'important');
    modalContent.style.setProperty('z-index', '60', 'important');

    // Remove any classes that might interfere
    modalContent.classList.remove('transform', 'transition-all');

    // Force a reflow
    void modalContent.offsetHeight;

    // Debug: Log final position and verify
    setTimeout(() => {
        const actualRect = modalContent.getBoundingClientRect();
        console.log('Modal positioned at:', {
            expectedTop: Math.round(top),
            actualTop: Math.round(actualRect.top),
            expectedLeft: Math.round(left),
            actualLeft: Math.round(actualRect.left),
            modalHeight: Math.round(modalHeight),
            modalWidth: Math.round(modalWidth),
            difference: Math.round(actualRect.top - top),
            parentTransform: modalParent ? window.getComputedStyle(modalParent).transform : 'none',
            parentPosition: modalParent ? window.getComputedStyle(modalParent).position : 'none'
        });
    }, 10);
}

// Old function - removed, using positionModalNearElement instead
function updateModalPosition_DEPRECATED(forceVisible = false, triggerElement = null) {
    // Use provided trigger element or fallback to currentTriggerElement
    const trigger = triggerElement || currentTriggerElement;
    if (!trigger || elements.modal.classList.contains('hidden')) return;

    // Verify the trigger element is still valid and in the DOM
    if (!trigger.isConnected || typeof trigger.getBoundingClientRect !== 'function') {
        return;
    }

    const padding = 12;
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;

    // Ensure modal doesn't exceed viewport height
    const maxAllowedHeight = window.innerHeight - (padding * 2);
    modalContent.style.maxHeight = `${maxAllowedHeight}px`;

    // Temporarily make visible (but transparent) to get accurate dimensions if needed
    const wasHidden = !forceVisible && elements.modal.style.visibility === 'hidden';
    if (wasHidden) {
        elements.modal.style.visibility = 'visible';
        elements.modal.style.opacity = '0';
        elements.modal.style.pointerEvents = 'none';
    }

    // Force a reflow to ensure dimensions are calculated
    void modalContent.offsetHeight;

    // Recalculate modalHeight after setting maxHeight
    // Use scrollHeight as fallback if offsetHeight is 0
    let modalHeight = modalContent.offsetHeight;
    if (modalHeight === 0) {
        modalHeight = modalContent.scrollHeight;
    }
    // If still 0, use a reasonable default
    if (modalHeight === 0) {
        modalHeight = 200; // Fallback default height
    }

    // Get trigger element position
    let rect;
    try {
        rect = trigger.getBoundingClientRect();
    } catch (e) {
        return;
    }
    const viewportHeight = window.innerHeight;
    const spacing = 16; // Increased spacing from button

    // Determine button position in viewport
    const buttonCenterY = rect.top + (rect.height / 2);
    const viewportCenterY = viewportHeight / 2;
    const isButtonInLowerHalf = buttonCenterY > viewportCenterY;

    // Calculate available space
    const spaceBelow = viewportHeight - rect.bottom - spacing;
    const spaceAbove = rect.top - spacing;

    let top;

    // If button is in lower half of viewport, prefer showing above
    // If button is in upper half, prefer showing below
    if (isButtonInLowerHalf) {
        // Button is in lower half - try above first
        if (spaceAbove >= modalHeight + padding) {
            // Fits above
            top = rect.top - modalHeight - spacing;
        } else if (spaceBelow >= modalHeight + padding) {
            // Doesn't fit above, but fits below
            top = rect.bottom + spacing;
        } else {
            // Neither fits - position above but clamp to viewport
            top = Math.max(padding, rect.top - modalHeight - spacing);
        }
    } else {
        // Button is in upper half - try below first
        if (spaceBelow >= modalHeight + padding) {
            // Fits below
            top = rect.bottom + spacing;
        } else if (spaceAbove >= modalHeight + padding) {
            // Doesn't fit below, but fits above
            top = rect.top - modalHeight - spacing;
        } else {
            // Neither fits - position below but clamp to viewport
            top = Math.min(viewportHeight - modalHeight - padding, rect.bottom + spacing);
        }
    }

    // Final clamp to ensure it doesn't go off-screen
    top = Math.max(padding, Math.min(top, viewportHeight - modalHeight - padding));


    // Use fixed positioning relative to viewport
    // Force fixed positioning with !important to override any CSS
    modalContent.style.setProperty('position', 'fixed', 'important');
    modalContent.style.setProperty('top', `${top}px`, 'important');
    modalContent.style.setProperty('left', '50%', 'important');
    modalContent.style.setProperty('transform', 'translateX(-50%)', 'important');
    modalContent.style.setProperty('right', 'auto', 'important');
    modalContent.style.setProperty('bottom', 'auto', 'important');
    modalContent.style.setProperty('margin', '0', 'important');
    modalContent.style.setProperty('width', 'auto', 'important');
    modalContent.style.setProperty('max-width', '24rem', 'important');
    modalContent.style.setProperty('z-index', '60', 'important');

    // IMPORTANT: Disable CSS animation to avoid transform conflict
    modalContent.style.setProperty('animation', 'none', 'important');

    // Force a reflow to ensure styles are applied
    void modalContent.offsetHeight;

    // Restore visibility state if it was hidden
    if (wasHidden) {
        elements.modal.style.visibility = 'hidden';
        elements.modal.style.opacity = '';
        elements.modal.style.pointerEvents = '';
    }
}

function showModal(title, message, isConfirm = false, triggerElement = null) {
    return new Promise((resolve) => {
        const modalContent = document.getElementById('modal-content');
        if (!modalContent) {
            // Fallback to alert if modal doesn't exist
            if (isConfirm) {
                resolve(confirm(message));
            } else {
                alert(message);
                resolve(true);
            }
            return;
        }

        // Set content
        elements.modalTitle.textContent = title;
        elements.modalMessage.textContent = message;

        // Show/hide cancel button
        if (isConfirm) {
            elements.modalCancelBtn.classList.remove('hidden');
        } else {
            elements.modalCancelBtn.classList.add('hidden');
        }

        // Remove ALL classes that might interfere with positioning
        // Keep only essential classes
        modalContent.className = 'bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto';

        // Show modal container
        elements.modal.style.display = 'flex';
        elements.modal.classList.remove('hidden');
        elements.modal.style.visibility = 'visible';

        // Position modal near trigger element if provided
        currentTriggerElement = triggerElement;
        if (triggerElement) {
            // Remove center classes that might interfere
            elements.modal.classList.remove('items-center', 'justify-center');

            // CRITICAL: Ensure modal container is fixed and covers viewport
            // This must be done BEFORE positioning the content
            elements.modal.style.setProperty('position', 'fixed', 'important');
            elements.modal.style.setProperty('top', '0', 'important');
            elements.modal.style.setProperty('left', '0', 'important');
            elements.modal.style.setProperty('width', '100%', 'important');
            elements.modal.style.setProperty('height', '100%', 'important');
            elements.modal.style.setProperty('transform', 'none', 'important');
            elements.modal.style.setProperty('margin', '0', 'important');
            elements.modal.style.setProperty('padding', '0', 'important');

            // First make it visible but transparent to measure
            modalContent.style.opacity = '0';
            elements.modal.style.visibility = 'visible';
            elements.modal.style.display = 'flex';

            // Wait for layout, then position and show
            requestAnimationFrame(() => {
                positionModalNearElement(triggerElement);

                // Verify position was set correctly after a short delay
                setTimeout(() => {
                    const actualRect = modalContent.getBoundingClientRect();
                    const expectedTop = parseInt(modalContent.style.top) || 0;
                    console.log('Position verification:', {
                        expectedTop: modalContent.style.top,
                        actualTop: Math.round(actualRect.top),
                        buttonTop: Math.round(triggerElement.getBoundingClientRect().top),
                        difference: Math.round(actualRect.top - expectedTop),
                        scrollY: window.scrollY
                    });
                }, 50);

                // Show with fade in
                requestAnimationFrame(() => {
                    modalContent.style.opacity = '1';
                    modalContent.style.transition = 'opacity 0.2s';
                });
            });
        } else {
            // Center in viewport
            elements.modal.classList.add('items-center', 'justify-center');
            modalContent.style.position = 'relative';
            modalContent.style.top = 'auto';
            modalContent.style.left = 'auto';
            modalContent.style.transform = 'none';
            modalContent.style.opacity = '1';
        }

        // Setup button handlers
        const cleanup = () => {
            elements.modal.classList.add('hidden');
            elements.modal.style.display = 'none';
            elements.modal.style.visibility = 'hidden';
            currentTriggerElement = null;
        };

        const handleConfirm = () => {
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            cleanup();
            resolve(false);
        };

        // Remove old listeners and add new ones
        const newConfirmBtn = elements.modalConfirmBtn.cloneNode(true);
        elements.modalConfirmBtn.parentNode.replaceChild(newConfirmBtn, elements.modalConfirmBtn);
        elements.modalConfirmBtn = newConfirmBtn;
        elements.modalConfirmBtn.textContent = t('confirm');

        const newCancelBtn = elements.modalCancelBtn.cloneNode(true);
        elements.modalCancelBtn.parentNode.replaceChild(newCancelBtn, elements.modalCancelBtn);
        elements.modalCancelBtn = newCancelBtn;
        elements.modalCancelBtn.textContent = t('cancel');

        elements.modalConfirmBtn.addEventListener('click', handleConfirm);
        if (!isConfirm) {
            // For non-confirm modals, clicking confirm also closes
            elements.modalConfirmBtn.addEventListener('click', handleConfirm);
        }
        elements.modalCancelBtn.addEventListener('click', handleCancel);

        // Close on backdrop click
        const backdropClick = (e) => {
            if (e.target === elements.modal) {
                cleanup();
                resolve(false);
                elements.modal.removeEventListener('click', backdropClick);
            }
        };
        elements.modal.addEventListener('click', backdropClick);
    });
}

function closeModal() {
    elements.modal.classList.add('hidden');
    elements.modal.style.display = 'none';
    elements.modal.style.visibility = 'hidden';
    currentTriggerElement = null;
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
// Update UI language
function updateLanguageUI() {
    // Update HTML lang attribute for date picker
    const lang = state.settings.language === 'zh' ? 'zh-TW' : 'en-US';
    document.documentElement.lang = lang;

    // Header
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) headerTitle.textContent = t('header-title');
    const langDisplay = document.getElementById('lang-display');
    if (langDisplay) langDisplay.textContent = t('lang-display');

    // Travel Info Section
    const travelInfoTitle = document.querySelector('#travel-info h2');
    if (travelInfoTitle) travelInfoTitle.textContent = t('travel-info');
    const editBtn = document.getElementById('edit-info-btn');
    if (editBtn) editBtn.textContent = t('edit');
    const saveBtn = document.getElementById('save-info-btn');
    if (saveBtn) saveBtn.textContent = t('save');

    // Update labels and date inputs
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        // Update date input lang attribute
        startDateInput.setAttribute('lang', lang);
        startDateInput.lang = lang;

        // Update label - now input is wrapped in .input-outline div
        const inputContainer = startDateInput.closest('.input-outline');
        if (inputContainer) {
            const startDateLabel = inputContainer.previousElementSibling;
            if (startDateLabel && startDateLabel.tagName === 'LABEL') {
                startDateLabel.textContent = t('start-date');
            }
        }
    }

    const endDateInput = document.getElementById('end-date');
    if (endDateInput) {
        // Update date input lang attribute
        endDateInput.setAttribute('lang', lang);
        endDateInput.lang = lang;

        // Update label - now input is wrapped in .input-outline div
        const inputContainer = endDateInput.closest('.input-outline');
        if (inputContainer) {
            const endDateLabel = inputContainer.previousElementSibling;
            if (endDateLabel && endDateLabel.tagName === 'LABEL') {
                endDateLabel.textContent = t('end-date');
            }
        }
    }

    const locationInput = document.getElementById('location');
    if (locationInput) {
        // Update label - now input is wrapped in .input-outline div
        const inputContainer = locationInput.closest('.input-outline');
        if (inputContainer) {
            const locationLabel = inputContainer.previousElementSibling;
            if (locationLabel && locationLabel.tagName === 'LABEL') {
                locationLabel.textContent = t('location');
            }
        }
        locationInput.placeholder = t('location-placeholder');
    }

    const budgetInput = document.getElementById('total-budget');
    if (budgetInput) {
        // Update label - now input is wrapped in .input-outline div
        const inputContainer = budgetInput.closest('.input-outline');
        if (inputContainer) {
            const budgetLabel = inputContainer.previousElementSibling;
            if (budgetLabel && budgetLabel.tagName === 'LABEL') {
                budgetLabel.textContent = t('total-budget');
            }
        }
    }

    // Exchange Rate Section
    const exchangeRateTitle = document.querySelector('#exchange-rate h2');
    if (exchangeRateTitle) exchangeRateTitle.textContent = t('exchange-rate');

    // Update currency label
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
        // Update label - now select is wrapped in .input-outline div
        const selectContainer = currencySelect.closest('.input-outline');
        if (selectContainer) {
            const currencyLabel = selectContainer.previousElementSibling;
            if (currencyLabel && currencyLabel.tagName === 'LABEL') {
                currencyLabel.textContent = t('currency');
            }
        }
    }

    // Update rate label - need to find the label before the input-outline div
    const exchangeRateInput = document.getElementById('exchange-rate-input');
    if (exchangeRateInput) {
        const exchangeRateInputContainer = exchangeRateInput.closest('.input-outline');
        if (exchangeRateInputContainer) {
            const rateLabel = exchangeRateInputContainer.previousElementSibling;
            if (rateLabel && rateLabel.tagName === 'LABEL') {
                rateLabel.textContent = t('rate-label');
            }
        }
    }

    const fetchRateBtn = document.getElementById('fetch-rate-btn');
    if (fetchRateBtn) fetchRateBtn.textContent = t('update-rate');

    // Update tax rate label
    const taxRateInput = document.getElementById('tax-rate-input');
    if (taxRateInput) {
        const taxRateInputContainer = taxRateInput.closest('.input-outline');
        if (taxRateInputContainer) {
            // The label is inside the parent div, before the input-outline div
            const taxRateContainer = taxRateInputContainer.parentElement;
            if (taxRateContainer) {
                // Find label inside the container (it's the first child)
                const taxRateLabel = taxRateContainer.querySelector('label');
                if (taxRateLabel) {
                    taxRateLabel.textContent = t('tax-rate');
                }
            }
        }
    }

    const rateApiBtn = document.getElementById('rate-api-btn');
    if (rateApiBtn) rateApiBtn.textContent = t('rate-mode-realtime');
    const rateManualBtn = document.getElementById('rate-manual-btn');
    if (rateManualBtn) rateManualBtn.textContent = t('rate-mode-manual');

    // Update currency select options (currencySelect already defined above)
    if (currencySelect) {
        const currencies = ['TWD', 'JPY', 'USD', 'EUR', 'GBP', 'AUD', 'THB', 'CNY', 'KRW', 'CAD'];
        currencies.forEach(currency => {
            const option = currencySelect.querySelector(`option[value="${currency}"]`);
            if (option) {
                // For English, just show the currency code (e.g., "USD")
                // For Chinese, show code + name (e.g., "USD 美金")
                if (state.settings.language === 'en') {
                    option.textContent = currency;
                } else {
                    option.textContent = `${currency} ${t(`currency-${currency.toLowerCase()}`)}`;
                }
            }
        });
    }

    // Mode Switcher
    const cartModeBtn = document.getElementById('mode-cart-btn');
    if (cartModeBtn) cartModeBtn.textContent = t('cart-mode');
    const directModeBtn = document.getElementById('mode-direct-btn');
    if (directModeBtn) directModeBtn.textContent = t('direct-mode');

    // Cart Input - Update category buttons
    const cartCategoryButtons = document.querySelectorAll('#cart-input-panel .category-btn span:last-child');
    cartCategoryButtons.forEach(btn => {
        const categoryBtn = btn.closest('.category-btn');
        if (categoryBtn) {
            const category = categoryBtn.dataset.category;
            btn.textContent = t(`category-${category}`);
        }
    });

    const cartTaxLabel = document.querySelector('label[for="cart-tax-toggle"]');
    if (cartTaxLabel) cartTaxLabel.textContent = t('include-tax');
    const itemPriceInput = document.getElementById('item-price');
    if (itemPriceInput) itemPriceInput.placeholder = t('amount-foreign');
    const itemQuantityInput = document.getElementById('item-quantity');
    if (itemQuantityInput) itemQuantityInput.placeholder = t('quantity');
    const cartPreview = document.getElementById('cart-twd-preview');
    if (cartPreview && cartPreview.previousSibling) {
        cartPreview.previousSibling.textContent = t('preview') + ': ';
    }
    const addItemBtn = document.getElementById('add-item-btn');
    if (addItemBtn) addItemBtn.innerHTML = `<span class="text-xl mr-2">+</span> ${t('add-to-cart')}`;

    // Direct Input - Update category buttons
    const directCategoryButtons = document.querySelectorAll('#direct-input-panel .category-btn span:last-child');
    directCategoryButtons.forEach(btn => {
        const categoryBtn = btn.closest('.category-btn');
        if (categoryBtn) {
            const category = categoryBtn.dataset.category;
            btn.textContent = t(`category-${category}`);
        }
    });

    const directTaxLabel = document.querySelector('label[for="direct-tax-toggle"]');
    if (directTaxLabel) directTaxLabel.textContent = t('include-tax');
    const directPriceInput = document.getElementById('direct-price');
    if (directPriceInput) directPriceInput.placeholder = t('amount-foreign');
    const directPreview = document.getElementById('direct-twd-preview');
    if (directPreview && directPreview.previousSibling) {
        directPreview.previousSibling.textContent = t('preview') + ': ';
    }
    const addExpenseBtn = document.getElementById('add-expense-btn');
    if (addExpenseBtn) addExpenseBtn.textContent = t('confirm-expense');

    // Cart Staging
    const cartListTitle = document.querySelector('#cart-staging-area h3 span');
    if (cartListTitle) cartListTitle.textContent = t('cart-list');

    // Update initial "cart empty" message if it exists
    const cartEmptyMsg = document.querySelector('#cart-items-list .text-center.text-gray-400');
    if (cartEmptyMsg && cartEmptyMsg.textContent.includes('購物車是空的')) {
        cartEmptyMsg.textContent = t('cart-empty');
    }

    // Update subtotal label - find directly in cart staging area
    const cartStagingArea = document.getElementById('cart-staging-area');
    if (cartStagingArea) {
        // Find all spans with text-sm and text-gray-600 classes
        const allSpans = cartStagingArea.querySelectorAll('span.text-sm.text-gray-600');
        allSpans.forEach(span => {
            // Check if this span contains the subtotal text
            const text = span.textContent.trim();
            if (text === '小計 (預估)' || text === 'Subtotal (Est.)' || text.includes('小計') || text.includes('Subtotal')) {
                span.textContent = t('subtotal');
            }
        });
    }
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.textContent = t('checkout');

    // Statistics
    const statsTitle = document.querySelector('#stats-section h3');
    if (statsTitle) statsTitle.textContent = t('stats-overview');
    const dailyAvgLabel = document.querySelector('#stats-section .text-xs.text-teal-600');
    if (dailyAvgLabel) dailyAvgLabel.textContent = t('daily-average');
    const topExpenseLabel = document.querySelector('#stats-section .text-xs.text-cyan-600');
    if (topExpenseLabel) topExpenseLabel.textContent = t('top-expense');

    // List View
    const listViewTitle = document.querySelector('#list-view h3');
    if (listViewTitle) listViewTitle.textContent = t('expense-details');

    // Update initial "no items" message if it exists
    const noItemsMsg = elements.itemsList.querySelector('.text-center.text-gray-400');
    if (noItemsMsg && noItemsMsg.textContent.includes('尚未新增')) {
        noItemsMsg.textContent = t('no-items');
    }

    const showMoreBtn = document.getElementById('show-more-btn');
    if (showMoreBtn && !showMoreBtn.classList.contains('hidden')) {
        const items = Array.from(elements.itemsList.children).filter(el => !el.classList.contains('item-fade-out'));
        const maxVisible = 5;
        if (items.length > maxVisible) {
            showMoreBtn.textContent = uiState.itemsExpanded ? t('show-less') : `${t('show-more')} (${items.length - maxVisible} ${state.settings.language === 'zh' ? '筆' : 'items'})`;
        } else {
            showMoreBtn.textContent = t('show-more');
        }
    } else if (showMoreBtn && showMoreBtn.textContent.includes('顯示更多')) {
        showMoreBtn.textContent = t('show-more');
    }

    // Footer
    const budgetUsageLabel = document.querySelector('footer .text-xs.text-gray-500');
    if (budgetUsageLabel) budgetUsageLabel.textContent = t('budget-usage');
    const budgetLabels = document.querySelectorAll('footer .text-sm.text-gray-500');
    if (budgetLabels.length >= 3) {
        budgetLabels[0].textContent = t('budget');
        budgetLabels[1].textContent = t('total-spent');
        budgetLabels[2].textContent = t('remaining');
    }
    const budgetWarning = document.getElementById('budget-warning');
    if (budgetWarning) budgetWarning.textContent = t('budget-warning');

    // Modal - Always update to ensure correct language
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        // Only update if it's still the default Chinese text
        if (modalTitle.textContent === '提示' || modalTitle.textContent === 'Tip') {
            modalTitle.textContent = t('tip');
        }
    }
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    if (modalConfirmBtn) {
        // Always update confirm button
        modalConfirmBtn.textContent = t('confirm');
    }
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    if (modalCancelBtn) {
        // Always update cancel button
        modalCancelBtn.textContent = t('cancel');
    }

    // Update date displays if they are in text mode (disabled/view mode)
    if (elements.startDate && elements.startDate.type === 'text' && elements.startDate.dataset.actualValue) {
        elements.startDate.value = formatDateForDisplay(elements.startDate.dataset.actualValue);
    }
    if (elements.endDate && elements.endDate.type === 'text' && elements.endDate.dataset.actualValue) {
        elements.endDate.value = formatDateForDisplay(elements.endDate.dataset.actualValue);
    }

    // Re-render items to update translations
    render();
}

// Switch language
function switchLanguage() {
    state.settings.language = state.settings.language === 'zh' ? 'en' : 'zh';
    localStorage.setItem('language', state.settings.language);
    saveData();
    updateLanguageUI();
}

function init() {
    console.log('Pocket Trip Initialized');
    const hasData = loadData();
    // Ensure inputs are in correct display mode (text mode for dates)
    // If no data (first launch), default to edit mode (true). Otherwise view mode (false).
    toggleTravelInfoEdit(!hasData);
    setupEventListeners();
    restoreCollapsedStates();
    updateLanguageUI();
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
    const savedState = localStorage.getItem('pocketTripState');
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

        // If TWD is selected, disable exchange rate input
        if (state.settings.currency === 'TWD') {
            elements.exchangeRateInput.disabled = true;
            elements.fetchRateBtn.disabled = true;
            elements.fetchRateBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        // Restore cart items if any
        if (parsed.cartItems) {
            state.cartItems = parsed.cartItems;
        }
        return true; // Data loaded
    } else {
        // No saved data - ensure input fields have default values
        elements.exchangeRateInput.value = state.settings.exchangeRate;
        elements.taxRateInput.value = state.settings.taxRate;
        return false; // No data found
    }
}

function saveData() {
    localStorage.setItem('pocketTripState', JSON.stringify(state));
}

function toggleTravelInfoEdit(isEditing) {
    elements.travelInfoInputs.forEach(input => {
        input.disabled = !isEditing;
        // Note: Disabled styles are now handled by CSS (.input-outline:has(.input-outline__field:disabled))
        // Restore date input type for date inputs
        if (isEditing) {
            if (input.id === 'start-date' || input.id === 'end-date') {
                // Restore value FIRST to ensure it's valid for type="date"
                if (input.dataset.actualValue) {
                    input.value = input.dataset.actualValue;
                }
                // Force update language attribute to ensure native picker renders correctly
                const lang = state.settings.language === 'zh' ? 'zh-TW' : 'en-US';
                input.setAttribute('lang', lang);

                input.type = 'date';
            }
        } else {
            // For date inputs, convert to text and format the display
            if (input.id === 'start-date' || input.id === 'end-date') {
                const dateValue = input.value;
                if (dateValue) {
                    input.type = 'text';
                    input.value = formatDateForDisplay(dateValue);
                    // Store the original value in a data attribute
                    input.dataset.actualValue = dateValue;
                }
            }
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
        // If TWD is selected, set exchange rate to 1 and disable input
        if (state.settings.currency === 'TWD') {
            state.settings.exchangeRate = 1;
            elements.exchangeRateInput.value = '1';
            elements.exchangeRateInput.disabled = true;
            elements.fetchRateBtn.disabled = true;
            elements.fetchRateBtn.classList.add('opacity-50', 'cursor-not-allowed');
            saveData();
            updateCartTwdPreview();
            updateDirectTwdPreview();
        } else {
            // Re-enable input if switching away from TWD
            if (state.settings.rateMode === 'manual') {
                elements.exchangeRateInput.disabled = false;
            }
            elements.fetchRateBtn.disabled = false;
            elements.fetchRateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            saveData();
            if (state.settings.rateMode === 'api') {
                fetchExchangeRate();
            }
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
    elements.checkoutBtn.addEventListener('click', (e) => { e.preventDefault(); checkoutCart(e); });

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

    // Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', switchLanguage);
    }
}

async function fetchExchangeRate() {
    const currency = state.settings.currency;

    // If TWD is selected, set rate to 1 and return
    if (currency === 'TWD') {
        state.settings.exchangeRate = 1;
        elements.exchangeRateInput.value = '1';
        saveData();
        updateCartTwdPreview();
        updateDirectTwdPreview();
        return;
    }

    const btn = document.getElementById('fetch-rate-btn');
    const originalText = btn.textContent;

    btn.textContent = t('updating');
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
            saveData();
            updateCartTwdPreview();
            updateDirectTwdPreview();
            showModal(t('success'), `${t('rate-updated')}：1 ${currency} = ${rate} TWD`, false, btn);
        } else {
            throw new Error('無法取得匯率');
        }
    } catch (error) {
        console.error(error);
        showModal(t('error'), t('rate-update-failed'), false, btn);
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

    const total = Math.round(price * quantity * exchangeRate * (1 + taxRate / 100) * 10) / 10;
    elements.cartTwdPreview.textContent = `NT$ ${total}`;
}

function updateDirectTwdPreview() {
    const price = parseFloat(elements.directPrice.value) || 0;
    // Read exchange rate from input field to get the most current value
    const exchangeRate = parseFloat(elements.exchangeRateInput.value) || state.settings.exchangeRate || 0;
    const applyTax = elements.directTaxToggle.checked;
    const taxRate = applyTax ? (parseFloat(elements.taxRateInput.value) || state.settings.taxRate || 0) : 0;

    const total = Math.round(price * exchangeRate * (1 + taxRate / 100) * 10) / 10;
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
        const addItemBtn = document.getElementById('add-item-btn');
        showModal(t('tip'), t('select-category-price'), false, addItemBtn);
        return;
    }

    const category = activeCategoryBtn.dataset.category;
    const categoryIcon = activeCategoryBtn.querySelector('span').textContent;
    const categoryName = activeCategoryBtn.querySelector('span:last-child').textContent;

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
        const addExpenseBtn = document.getElementById('add-expense-btn');
        showModal(t('tip'), t('select-category-amount'), false, addExpenseBtn);
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

// Format date for display in travel info (YYYY-MM-DD -> localized format)
function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr + 'T00:00:00'); // Add time to avoid timezone issues
        if (isNaN(date.getTime())) return dateStr;

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if (state.settings.language === 'zh') {
            return `${year}年${month}月${day}日`;
        } else {
            // English format: Month Day, Year (e.g., "Jan 15, 2024")
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[month - 1]} ${day}, ${year}`;
        }
    } catch (e) {
        return dateStr;
    }
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';

        const now = new Date();
        // Get start of today (00:00:00)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffMs = todayStart - itemDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // Show relative time only for today's items
        if (diffDays === 0) {
            const timeDiffMs = now - date;
            const diffHours = Math.floor(timeDiffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(timeDiffMs / (1000 * 60));
                return diffMinutes <= 1 ? t('just-now') : `${diffMinutes} ${t('minutes-ago')}`;
            }
            return diffHours === 1 ? `1 ${t('hour-ago')}` : `${diffHours} ${t('hours-ago')}`;
        }
        // For previous days (including yesterday), show absolute date
        else {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${month}/${day}`;
        }
    } catch (e) {
        return '';
    }
}

function renderItems() {
    elements.itemsList.innerHTML = '';

    if (state.items.length === 0) {
        elements.itemsList.innerHTML = `<div class="text-center text-gray-400 py-8 text-sm">${t('no-items')}</div>`;
        elements.showMoreBtn.classList.add('hidden');
        return;
    }

    // Sort items: first by date (newest first), then by category
    const sortedItems = [...state.items].sort((a, b) => {
        // Sort by timestamp (descending - newest first)
        const timeDiff = new Date(b.timestamp) - new Date(a.timestamp);
        if (timeDiff !== 0) return timeDiff;

        // If same timestamp, sort by category alphabetically
        const catA = a.category || 'other';
        const catB = b.category || 'other';
        return catA.localeCompare(catB);
    });

    // Determine how many items to show
    const maxVisible = 5;
    const shouldShowMore = sortedItems.length > maxVisible;
    const itemsToShow = uiState.itemsExpanded ? sortedItems : sortedItems.slice(0, maxVisible);

    itemsToShow.forEach(item => {
        const itemEl = document.createElement('div');

        // Category color mapping
        const categoryColors = {
            'food': '#10B981',      // Emerald - Food
            'transport': '#06B6D4', // Cyan - Transport
            'hotel': '#8B5CF6',     // Violet - Hotel
            'attraction': '#F59E0B',// Amber - Attraction
            'shopping': '#EC4899',  // Pink - Shopping
            'flight': '#3B82F6',    // Blue - Flight
            'other': '#6B7280'      // Gray - Other
        };

        const borderColor = categoryColors[item.category] || categoryColors['other'];

        itemEl.className = 'item-card bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden transition-all duration-200';
        itemEl.style.borderLeft = `4px solid ${borderColor}`;

        const totalTWD = Math.round(item.price * item.exchangeRate * (1 + item.taxRate / 100) * (item.quantity || 1) * 10) / 10;
        const dateStr = formatDate(item.timestamp);

        let iconHtml = '';
        let titleHtml = '';
        let descHtml = '';

        if (item.type === 'cart') {
            iconHtml = `<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">${item.icon || '🛒'}</div>`;
            // Use getCategoryName to ensure name updates when language changes
            titleHtml = `<div class="font-medium text-gray-800">${getCategoryName(item.category)}</div>`;
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
                <div class="font-bold text-gray-800 tabular-nums">NT$ ${totalTWD.toLocaleString()}</div>
                <button onclick="deleteItem(${item.id}, event)" class="delete-btn text-xs text-red-400 hover:text-red-600 p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;
        elements.itemsList.appendChild(itemEl);
    });

    // Show/hide "Show More" button
    if (shouldShowMore) {
        elements.showMoreBtn.classList.remove('hidden');
        const itemText = state.settings.language === 'zh' ? '筆' : 'items';
        elements.showMoreBtn.textContent = uiState.itemsExpanded ? t('show-less') : `${t('show-more')} (${sortedItems.length - maxVisible} ${itemText})`;
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

    const dailyAvg = Math.round((totalSpent / dayCount) * 10) / 10;
    dailyAverageEl.textContent = `NT$ ${dailyAvg.toLocaleString()}`;

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
    topCategoryEl.textContent = `${categoryName} NT$ ${(Math.round(topAmount * 10) / 10).toLocaleString()}`;
}

function getCategoryName(cat) {
    const categoryKey = `category-${cat}`;
    return t(categoryKey) || t('expense');
}

async function deleteItem(id, event) {
    // Get trigger element from event if available
    // event.target might be the SVG or path inside the button, so we need to find the button
    let trigger = null;
    if (event) {
        trigger = event.target.closest('button') || event.target;
    }
    const confirmed = await showModal(t('confirm-delete'), t('confirm-delete-msg'), true, trigger);
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

    const budget = state.travelInfo.budget || 0;
    const remaining = budget - totalSpent;

    // Update footer displays
    const footerBudgetEl = document.getElementById('footer-budget');
    if (footerBudgetEl) {
        footerBudgetEl.textContent = `NT$ ${(Math.round(budget * 10) / 10).toLocaleString()}`;
    }

    elements.totalSpent.textContent = `NT$ ${(Math.round(totalSpent * 10) / 10).toLocaleString()}`;
    elements.remainingBudget.textContent = `NT$ ${(Math.round(remaining * 10) / 10).toLocaleString()}`;

    // Update progress bar
    const progressBar = document.getElementById('budget-progress-bar');
    const percentageEl = document.getElementById('budget-percentage');

    if (progressBar && percentageEl && budget > 0) {
        const percentage = Math.min((totalSpent / budget) * 100, 100);
        const displayPercentage = Math.round((totalSpent / budget) * 100); // Can exceed 100%

        progressBar.style.width = `${percentage}%`;
        percentageEl.textContent = `${displayPercentage}%`;

        // Color coding based on percentage
        if (displayPercentage < 70) {
            progressBar.style.backgroundColor = '#10B981'; // Green - Safe
            percentageEl.style.color = '#059669';
        } else if (displayPercentage < 90) {
            progressBar.style.backgroundColor = '#F59E0B'; // Amber - Warning
            percentageEl.style.color = '#D97706';
        } else {
            progressBar.style.backgroundColor = '#EF4444'; // Red - Danger
            percentageEl.style.color = '#DC2626';
        }
    }

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

// Checkout Cart - removed duplicate, already handled in setupEventListeners

function renderCart() {
    elements.cartItemsList.innerHTML = '';

    if (state.cartItems.length === 0) {
        elements.cartItemsList.innerHTML = `<div class="text-center text-gray-400 py-4 text-sm">${t('cart-empty')}</div>`;
        elements.cartSubtotal.textContent = 'NT$ 0';
        elements.cartCount.textContent = '(0)';
        return;
    }

    let subtotal = 0;

    state.cartItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'bg-gray-50 p-2 rounded border border-gray-100 flex justify-between items-center text-sm';

        const totalTWD = Math.round(item.price * item.exchangeRate * (1 + item.taxRate / 100) * (item.quantity || 1) * 10) / 10;
        subtotal += totalTWD;

        itemEl.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center border text-lg">${item.icon || '🛒'}</div>
                <div>
                    <div class="font-medium text-gray-700">${getCategoryName(item.category)}</div>
                    <div class="text-xs text-gray-400">${item.currency} ${item.price} x ${item.quantity}</div>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <div class="font-bold text-gray-700">NT$ ${totalTWD}</div>
                <button class="delete-btn text-red-400 hover:text-red-600" onclick="deleteCartItem(${item.id})">✕</button>
            </div>
        `;
        elements.cartItemsList.appendChild(itemEl);
    });

    // Round subtotal to avoid floating-point precision errors
    const roundedSubtotal = Math.round(subtotal * 10) / 10;
    elements.cartSubtotal.textContent = `NT$ ${roundedSubtotal}`;
    elements.cartCount.textContent = `(${state.cartItems.length})`;

    // Update subtotal label text after rendering
    const cartStagingArea = document.getElementById('cart-staging-area');
    if (cartStagingArea) {
        const subtotalLabel = cartStagingArea.querySelector('span.text-sm.text-gray-600');
        if (subtotalLabel && (subtotalLabel.textContent.includes('小計') || subtotalLabel.textContent.includes('Subtotal'))) {
            subtotalLabel.textContent = t('subtotal');
        }
    }
}

async function checkoutCart(event) {
    // Always get the checkout button directly by ID to ensure we have the correct element
    // This is more reliable than using event.target which might be a child element
    const trigger = document.getElementById('checkout-btn');

    if (!trigger) {
        return;
    }


    if (state.cartItems.length === 0) {
        showModal(t('tip'), t('cart-empty'), false, trigger);
        return;
    }

    const confirmed = await showModal(t('confirm-checkout'), `${t('confirm-checkout-msg')} ${state.cartItems.length} ${t('items')}？`, true, trigger);
    if (confirmed) {
        // Move items from cart to main list
        state.items = [...state.cartItems, ...state.items];
        state.cartItems = [];

        saveData();
        render();
        // Show success modal near the checkout button (or where it was)
        // Since checkout button might still be there (but cart empty), we can use it
        showModal(t('success'), t('checkout-success'), false, trigger);
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
