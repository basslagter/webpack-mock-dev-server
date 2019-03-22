# webpack-mock-dev-server
Mocks webpack dev server request in an easy configurable way

Add to webpack config like:

```javascript
module.exports = {
    ...,

    devServer: {
        ...,
        before: MockDevServer(path.join(__dirname, 'mock-api.config')),
    }
};
```

Example config:

```javascript
module.exports = {
    src: path.join(__dirname, 'fixtures'),
    entry: '/api/*',
    rules: [
        {
            test: '**/news',
            filename: 'news.json',
            headers: {
                'X-Total-Count': 5
            }
        },
    ],
}
```