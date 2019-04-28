module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "ecmaFeatures": {
        "classes": true,
        "jsx": true
    },
    "env": {
        "browser": true,
        "node": true
    },

    "plugins": [
        "react",
        "jsx-a11y",
        "import",
        "jest",
    ],
    "rules": {
        "no-script-url": "off"
    }
};
