# Pocket Trip - Travel Budget Helper ✈️💰

A lightweight budget and expense tracking web application designed specifically for travelers. Easily record expenses, calculate exchange rates in real-time, and keep track of your budget to avoid overspending during your trips.

## ✨ Key Features

### 1. Flexible Entry Modes
*   **🛒 Cart Mode**:
    *   Designed for shopping scenarios (e.g., drugstores, supermarkets).
    *   Add multiple items to a "staging list" with quantity and unit price support.
    *   Real-time preview of the total in your home currency (TWD) before confirming the checkout in one go.
*   **📝 Direct Entry**:
    *   Perfect for quick single-expense recording (e.g., dining, transport tickets).
    *   Simple and fast operation to record with just one click.

### 2. Smart Exchange Rate & Tax Calculation
*   **Multi-Currency Support**: Built-in support for major currencies like JPY, USD, EUR, and more.
*   **Exchange Rate Settings**:
    *   🔄 **Real-time Rate**: Supports API integration to fetch the latest market rates.
    *   ✍️ **Manual Rate**: Customize the rate based on your actual currency exchange.
*   **Tax Calculation**: Set local consumption tax rates (e.g., 10% in Japan) and toggle tax inclusion with one click to automatically calculate the final amount.

### 3. Budget & Statistics
*   **Budget Monitoring**: Set a total trip budget and view usage percentage instantly via a visual progress bar.
*   **Over-budget Warning**: Prominent warning alerts when your spending exceeds the budget.
*   **Expense Analysis**: Automatically calculates "Daily Average Spending" and "Top Expense Category" to help you understand where your money goes.

### 4. User-Friendly Design
*   **Multi-Language Interface**: Supports switching between Traditional Chinese and English interfaces.
*   **Data Persistence**: All data is automatically saved in the browser (LocalStorage), so nothing is lost even if you close the window or refresh.
*   **PWA Support**: Supports Progressive Web App, allowing you to "Add to Home Screen" and use it full-screen on your mobile device just like a native app.

## 🛠️ Tech Stack

This project is built with pure frontend technologies, lightweight and requiring no backend server:

*   **HTML5**: Semantic markup structure.
*   **CSS3**: Using **Tailwind CSS** (CDN) for rapid and modern styling.
*   **JavaScript (Vanilla JS)**: Native ES6+ syntax, no dependency on large frameworks (Vue/React), keeping it lightweight and efficient.

## 🚀 Getting Started

Since this is a static web project, you don't need to install Node.js or any database.

1.  **Download the Project**:
    ```bash
    git clone https://github.com/yourusername/travel-budget-helper.git
    ```
    Or download the ZIP file directly and extract it.

2.  **Open the Application**:
    *   Locate the `index.html` file in the folder.
    *   Double-click to open it directly in any browser (Chrome, Safari, Edge, etc.).
    *   Or use the "Live Server" extension in VS Code for the best experience.

## 📱 Mobile Installation (PWA)

For convenient use during your travels, it is recommended to install it on your phone:

*   **iOS (Safari)**:
    1. Open the page in Safari.
    2. Tap the "Share" button at the bottom.
    3. Scroll down and tap "Add to Home Screen".

*   **Android (Chrome)**:
    1. Open the page in Chrome.
    2. Tap the menu icon at the top right.
    3. Tap "Install app" or "Add to Home screen".

## 📝 License

MIT License
