module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/stock-storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared in-memory stock storage across all API routes
__turbopack_context__.s([
    "SUPPORTED_STOCKS",
    ()=>SUPPORTED_STOCKS,
    "addStock",
    ()=>addStock,
    "addToWatchlist",
    ()=>addToWatchlist,
    "getStockPrices",
    ()=>getStockPrices,
    "getUpdatedPrices",
    ()=>getUpdatedPrices,
    "getUserStocks",
    ()=>getUserStocks,
    "getWatchlist",
    ()=>getWatchlist,
    "removeFromWatchlist",
    ()=>removeFromWatchlist,
    "setUserStocks",
    ()=>setUserStocks,
    "unsubscribeStock",
    ()=>unsubscribeStock
]);
const userStocks = {};
const stockPrices = {
    GOOG: Math.random() * 100 + 120,
    TSLA: Math.random() * 100 + 200,
    AMZN: Math.random() * 100 + 150,
    META: Math.random() * 100 + 300,
    NVDA: Math.random() * 100 + 550
};
const SUPPORTED_STOCKS = [
    "GOOG",
    "TSLA",
    "AMZN",
    "META",
    "NVDA"
];
const userWatchlists = {};
function getUpdatedPrices() {
    Object.keys(stockPrices).forEach((symbol)=>{
        const lastPrice = stockPrices[symbol];
        const change = (Math.random() - 0.5) * 10;
        stockPrices[symbol] = Math.max(1, lastPrice + change);
    });
    return stockPrices;
}
function getUserStocks(userId) {
    const stocks = userStocks[userId] || [];
    console.log("[v0] getUserStocks - userId:", userId, "stocks count:", stocks.length);
    return stocks;
}
function setUserStocks(userId, stocks) {
    userStocks[userId] = stocks;
    console.log("[v0] setUserStocks - userId:", userId, "stocks count:", stocks.length);
}
function addStock(userId, symbol) {
    console.log("[v0] addStock - Before adding:", {
        userId,
        symbol,
        hasUserStocks: !!userStocks[userId],
        currentCount: userStocks[userId]?.length || 0
    });
    if (!userStocks[userId]) {
        userStocks[userId] = [];
        console.log("[v0] addStock - Created new array for userId:", userId);
    }
    if (userStocks[userId].some((s)=>s.symbol === symbol)) {
        console.log("[v0] addStock - Already subscribed:", {
            userId,
            symbol
        });
        return false;
    }
    userStocks[userId].push({
        symbol,
        price: stockPrices[symbol],
        lastPrice: stockPrices[symbol],
        priceHistory: [
            stockPrices[symbol]
        ]
    });
    console.log("[v0] addStock - After adding:", {
        userId,
        symbol,
        currentCount: userStocks[userId].length,
        allUserStocks: Object.keys(userStocks).map((uid)=>({
                userId: uid,
                count: userStocks[uid].length
            }))
    });
    return true;
}
function unsubscribeStock(userId, symbol) {
    if (!userStocks[userId]) {
        return false;
    }
    const index = userStocks[userId].findIndex((s)=>s.symbol === symbol);
    if (index === -1) {
        return false;
    }
    userStocks[userId].splice(index, 1);
    console.log("[v0] unsubscribeStock - Removed:", {
        userId,
        symbol,
        remainingCount: userStocks[userId].length
    });
    return true;
}
function getStockPrices() {
    return stockPrices;
}
function getWatchlist(userId) {
    return userWatchlists[userId] || [];
}
function addToWatchlist(userId, symbol) {
    if (!userWatchlists[userId]) {
        userWatchlists[userId] = [];
    }
    if (userWatchlists[userId].includes(symbol)) {
        return false // Already in watchlist
        ;
    }
    userWatchlists[userId].push(symbol);
    console.log("[v0] addToWatchlist - Added:", {
        userId,
        symbol,
        watchlistCount: userWatchlists[userId].length
    });
    return true;
}
function removeFromWatchlist(userId, symbol) {
    if (!userWatchlists[userId]) {
        return false;
    }
    const index = userWatchlists[userId].indexOf(symbol);
    if (index === -1) {
        return false;
    }
    userWatchlists[userId].splice(index, 1);
    console.log("[v0] removeFromWatchlist - Removed:", {
        userId,
        symbol,
        remainingCount: userWatchlists[userId].length
    });
    return true;
}
;
}),
"[project]/app/api/market/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stock$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stock-storage.ts [app-route] (ecmascript)");
;
async function GET() {
    try {
        const allSymbols = [
            "GOOG",
            "TSLA",
            "AMZN",
            "META",
            "NVDA"
        ];
        const updatedPrices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stock$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUpdatedPrices"])();
        const stocks = allSymbols.map((symbol)=>{
            const currentPrice = updatedPrices[symbol];
            const lastPrice = updatedPrices[`${symbol}_last`] || currentPrice;
            const change = currentPrice - lastPrice;
            const changePercent = change / lastPrice * 100 || 0;
            updatedPrices[`${symbol}_last`] = currentPrice;
            return {
                symbol,
                price: currentPrice,
                change,
                changePercent,
                timestamp: Date.now()
            };
        });
        return Response.json({
            stocks
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Market API error:", error);
        return Response.json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c19ac370._.js.map