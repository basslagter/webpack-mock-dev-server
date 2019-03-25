<div>
    <a href="https://npmcharts.com/compare/webpack?minimal=true">
        <img src="https://img.shields.io/npm/dm/webpack-mock-dev-server.svg">
    </a>
    <a href="https://packagephobia.now.sh/result?p=webpack">
        <img src="https://packagephobia.now.sh/badge?p=webpack-mock-dev-server" alt="install size">
    </a>
    <a href="https://github.com/webpack/webpack/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/basslagter/webpack-mock-dev-server.svg">
    </a>
</div>
	
<h1>webpack-mock-dev-server</h1>
<p>Mocks webpack dev server request in an easy configurable way</p>

## Table of Contents

1. [Install](#install)
2. [Introduction](#introduction)
3. [Get started](#get-started)
4. [Configuration](#configuration)

<h2 align="center">Install</h2>

Install with npm:

```bash
npm install --save-dev webpack-mock-dev-server
```

Install with yarn:

```bash
yarn add webpack-mock-dev-server --dev
```

<h2 align="center">Introduction</h2>

webpack-mock-dev-server is an easy to configure webpack helper which allows
to mock request passing through the webpack-dev-server. In the configuration file
you can specify which requests should be mocked and what response you would like to return.
It also allows to set specific headers on the response.

**TL;DR**

* Mock wepack-dev-server responses
* Easy configuration
* Allows to specify headers on the response

<h2 align="center">Get started</h2>

Open the webpack configuration file in which you have specified the dev-server configuration.
Modify the configuration like the example (1) below. Most of the time it would be needed to just add
the 'before' configuration option as shown in example 1. If you already have specified a function on the before
configuration option, call the MockDevServer function al shown in example 2.
<br/><br/>
Example 1:
```javascript
const { MockDevServer } = require('webpack-mock-dev-server');

module.exports = {
    ...,

    devServer: {
        ...,
        before: MockDevServer(path.join(__dirname, 'mock-dev-server.config')),
    }
};
```
Example 2:
```javascript
const { MockDevServer } = require('webpack-mock-dev-server');

module.exports = {
    ...,

    devServer: {
        ...,
        before: function before(app, server) {
            MockDevServer(path.join(__dirname, 'mock-dev-server.config'))(app);
        },
    }
};
```
The only argument needed is the path to the configuration file. If not specified it will look
for the file in the same directory as the webpack config file.
<br/><br/>
By default this will mock all response and throw warnings on all requests that do not have
a rule specified in the config file. See [Configuration](#configuration) to specify responses 
for specific requests.

<h2 align="center">Configuration</h2>

Create a file (mock-dev-server.config.js by default) in which you would like to specify the
mocking configurations. See the example below.

```javascript
module.exports = {
    src: path.join(__dirname, 'fixtures'),
    entry: '/api/*',
    rules: [
        {
            method: 'GET',
            test: '**/news',
            filename: 'news.json',
            headers: {
                'Content-Type': 'application/json'
            }
        },
    ],
}
```

Property list:

1. src: the base path to use when requesting mock files (fixtures). 
So the filename specified in the rules is relative to this path.
2. entry: the base path to use when targeting requests in the dev-server.
So each test in the rules is relative to this path.
3. rules: The set of rules to check when a requests occurs.
4. method (optional, default: GET): the method of the request 
5. test: the glob expression to match against
6. filename: the name of the file to return it's content from when the test succeeds.
7. headers (optional): any headers that need to be set them mocking the response.