module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["browserify", "mocha"],
    files: [
      "node_modules/babel/browser-polyfill.js",
      "test/*.js"
    ],
    browsers: ["Chrome", "Firefox", "IE"],

    preprocessors: {
      "test/*.js": ["browserify"]
    },
    browserify: {
      debug: true,
      transform: [
        "babelify",
        ["envify", {"NODE_ENV": "development"}],
        "espowerify"
      ]
    }
  });
};
