const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        main: "./src/main.ts",
    },
    output: {
        path: path.resolve(__dirname, "./Website"),
        filename: "hydro-bundle.js", // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
};
