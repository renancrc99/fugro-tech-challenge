import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        ignores: ["public/dist/src/*"]
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
);