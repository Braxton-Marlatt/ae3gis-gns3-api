module.exports = [
"[project]/.next-internal/server/app/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/page.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*#__PURE__*/ const { jsxDEV: _jsxDEV } = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
_jsxDEV("main", {
    className: "p-4",
    children: [
        /*#__PURE__*/ _jsxDEV("div", {
            className: "flex items-center justify-between mb-6 relative",
            children: [
                /*#__PURE__*/ _jsxDEV("h1", {
                    className: "text-xl font-bold",
                    children: "Scenario Name"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 4,
                    columnNumber: 5
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "absolute left-1/2 transform -translate-x-1/2",
                    children: /*#__PURE__*/ _jsxDEV("h1", {
                        className: "text-xl font-bold",
                        children: "Scenario Components"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 6,
                        columnNumber: 7
                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 5,
                    columnNumber: 5
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 3,
            columnNumber: 3
        }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
        /*#__PURE__*/ _jsxDEV("div", {
            className: "grid grid-cols-3 gap-6 mb-6 items-center",
            children: [
                /*#__PURE__*/ _jsxDEV(ScenarioInput, {
                    onChange: setScenarioName
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 13,
                    columnNumber: 5
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ _jsxDEV(TemplateDropdown, {
                        onSelect: setTemplateId
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 17,
                        columnNumber: 7
                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 16,
                    columnNumber: 5
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                /*#__PURE__*/ _jsxDEV("div", {}, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 21,
                    columnNumber: 5
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 11,
            columnNumber: 3
        }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
        /*#__PURE__*/ _jsxDEV("div", {
            className: "flex justify-center mb-6",
            children: /*#__PURE__*/ _jsxDEV(NameNode, {
                onChange: setNodeName
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 26,
                columnNumber: 5
            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 25,
            columnNumber: 3
        }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
        /*#__PURE__*/ _jsxDEV("div", {
            className: "flex justify-center",
            children: /*#__PURE__*/ _jsxDEV("button", {
                onClick: addNode,
                className: "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600",
                children: "Add Node"
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 31,
                columnNumber: 5
            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 30,
            columnNumber: 3
        }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
        /*#__PURE__*/ _jsxDEV("ul", {
            className: "mt-4",
            children: nodes.map((node, idx)=>/*#__PURE__*/ _jsxDEV("li", {
                    children: [
                        node.name,
                        " (",
                        node.template_id,
                        ") x:",
                        node.x,
                        " y:",
                        node.y
                    ]
                }, idx, true, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 42,
                    columnNumber: 7
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e))
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 40,
            columnNumber: 3
        }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
        /*#__PURE__*/ _jsxDEV("button", {
            onClick: saveScenario,
            className: "mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
            children: "Save Scenario"
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 49,
            columnNumber: 3
        }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
    ]
}, void 0, true, {
    fileName: "[project]/src/app/page.js",
    lineNumber: 1,
    columnNumber: 1
}, /*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/src/app/page.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.js [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__604d5496._.js.map