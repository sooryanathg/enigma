
export default {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  Settings: {
    react: { version: "detect" },
  },
};
