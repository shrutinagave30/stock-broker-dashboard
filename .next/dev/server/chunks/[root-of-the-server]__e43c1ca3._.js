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
"[project]/lib/user-storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared in-memory user database
__turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "getAllUsers",
    ()=>getAllUsers,
    "getUser",
    ()=>getUser
]);
const users = {
    "user1@example.com": {
        id: "1",
        email: "user1@example.com",
        password: "password123"
    },
    "user2@example.com": {
        id: "2",
        email: "user2@example.com",
        password: "password123"
    }
};
let nextUserId = 3;
function getUser(email) {
    return users[email];
}
function createUser(email, password) {
    if (users[email]) {
        return null // User already exists
        ;
    }
    const newUser = {
        id: String(nextUserId++),
        email,
        password
    };
    users[email] = newUser;
    return newUser;
}
function getAllUsers() {
    return users;
}
}),
"[project]/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/user-storage.ts [app-route] (ecmascript)");
;
// In-memory user database (persisted via localStorage in client)
const users = {
    "user1@example.com": {
        id: "1",
        email: "user1@example.com",
        password: "password123"
    },
    "user2@example.com": {
        id: "2",
        email: "user2@example.com",
        password: "password123"
    }
};
async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return Response.json({
                message: "Email and password required"
            }, {
                status: 400
            });
        }
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUser"])(email) || users[email];
        if (!user || user.password !== password) {
            return Response.json({
                message: "Invalid email or password"
            }, {
                status: 401
            });
        }
        return Response.json({
            user: {
                id: user.id,
                email: user.email
            },
            token: `token_${user.id}_${Date.now()}`
        }, {
            status: 200
        });
    } catch (error) {
        return Response.json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e43c1ca3._.js.map