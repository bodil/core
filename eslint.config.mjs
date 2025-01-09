import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "prettier"
    ),
    {
        languageOptions: {
            globals: {
                ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, "off"])),
            },

            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                tsconfigRootDir: path.resolve("."),
                project: ["./tsconfig.json"],
            },
        },

        settings: {
            wc: {
                elementBaseClasses: ["BorkbotElement"],
            },
        },

        rules: {
            curly: ["error", "all"],
            "default-case-last": "error",
            "default-param-last": "error",
            "dot-notation": "off",
            eqeqeq: ["error", "always"],
            "guard-for-in": "warn",

            "new-cap": [
                "error",
                {
                    newIsCap: true,
                    capIsNew: false,
                },
            ],

            "no-alert": "error",
            "no-console": "error",

            "no-constant-condition": [
                "error",
                {
                    checkLoops: false,
                },
            ],

            "no-else-return": [
                "warn",
                {
                    allowElseIf: true,
                },
            ],

            "no-empty": [
                "warn",
                {
                    allowEmptyCatch: true,
                },
            ],

            "no-invalid-regexp": "error",
            "no-lonely-if": "warn",
            "no-return-assign": "error",
            "no-return-await": "off",
            "no-template-curly-in-string": "error",
            "no-throw-literal": "error",
            "no-unneeded-ternary": "warn",
            "no-unreachable": "warn",
            "no-unused-expressions": "off",
            "no-unused-labels": "warn",
            "no-unused-vars": "off",
            "no-useless-call": "warn",
            "no-useless-catch": "warn",
            "no-useless-computed-key": "warn",
            "no-useless-concat": "warn",
            "no-useless-constructor": "off",
            "no-useless-escape": "warn",
            "no-useless-rename": "warn",
            "no-useless-return": "warn",
            "no-var": "error",
            "prefer-const": "warn",
            "prefer-destructuring": "off",
            "prefer-exponentiation-operator": "warn",
            "prefer-numeric-literals": "warn",
            "prefer-object-has-own": "warn",
            "prefer-object-spread": "warn",
            "prefer-promise-reject-errors": "off",
            "prefer-regex-literals": "warn",
            "prefer-rest-params": "warn",
            "prefer-spread": "warn",
            "prefer-template": "warn",
            radix: "error",
            "require-atomic-updates": "warn",
            "require-await": "off",
            "require-yield": "warn",
            "use-isnan": "error",
            "valid-typeof": "error",

            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/array-type": ["warn", { default: "generic", readonly: "generic" }],
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/consistent-generic-constructors": "warn",
            "@typescript-eslint/consistent-indexed-object-style": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/dot-notation": [
                "warn",
                { allowPrivateClassPropertyAccess: true, allowProtectedClassPropertyAccess: true },
            ],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-confusing-void-expression": "off",
            "@typescript-eslint/no-empty-function": [
                "error",
                {
                    allow: ["arrowFunctions"],
                },
            ],
            "@typescript-eslint/no-empty-object-type": [
                "error",
                {
                    allowInterfaces: "with-single-extends",
                },
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-extra-non-null-assertion": "warn",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-import-type-side-effects": "error",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/no-namespace": [
                "error",
                {
                    allowDeclarations: true,
                },
            ],
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-shadow": "off",
            "@typescript-eslint/no-this-alias": "error",
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
            "@typescript-eslint/no-unnecessary-condition": "off",
            "@typescript-eslint/no-unnecessary-qualifier": "warn",
            "@typescript-eslint/no-unnecessary-type-arguments": "warn",
            "@typescript-eslint/no-unnecessary-type-assertion": "warn",
            "@typescript-eslint/no-unnecessary-type-parameters": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/no-useless-constructor": "error",
            "@typescript-eslint/no-useless-empty-export": "warn",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/prefer-for-of": "warn",
            "@typescript-eslint/prefer-includes": "warn",
            "@typescript-eslint/prefer-optional-chain": ["warn", { requireNullish: true }],
            "@typescript-eslint/prefer-promise-reject-errors": "warn",
            "@typescript-eslint/prefer-readonly": "warn",
            "@typescript-eslint/prefer-reduce-type-parameter": "warn",
            "@typescript-eslint/prefer-regexp-exec": "warn",
            "@typescript-eslint/prefer-return-this-type": "warn",
            "@typescript-eslint/prefer-string-starts-ends-with": "warn",
            "@typescript-eslint/promise-function-async": "off",
            "@typescript-eslint/restrict-template-expressions": [
                "error",
                { allowAny: true, allowNumber: true },
            ],
            "@typescript-eslint/require-await": "error",
            "@typescript-eslint/return-await": "error",
            "@typescript-eslint/sort-type-constituents": "off",
            "@typescript-eslint/strict-boolean-expressions": "error",

            "@typescript-eslint/switch-exhaustiveness-check": "warn",
            "@typescript-eslint/typedef": "off",
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/unified-signatures": "warn",
            "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
        },
    },

    // JSDoc

    jsdoc.configs["flat/contents-typescript"],
    jsdoc.configs["flat/logical-typescript"],
    jsdoc.configs["flat/stylistic-typescript"],
    {
        files: ["src/**/*.ts"],
        plugins: { jsdoc },
        rules: {
            "jsdoc/require-jsdoc": "off",
            "jsdoc/match-description": "off",
            "jsdoc/lines-before-block": "off",
            "jsdoc/tag-lines": "off",
        },
    },
];
