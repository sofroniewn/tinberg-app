# tinberg-app
App for controlling trial based behavior experiments

```
npm install tinberg-app
```

This app can be used along with an `experiment` and a `device` to control a trial based behavior experiment.

## Usage
To launch the app with the default `experiment` and `device` (for basic benchmarking) use the following

```js
electron index.js
```

To launch the app with custom a `experiment` and `device` use the `-e` and `-d` inputs followed by paths to the relevant `experiment` and `device` modules.

```js
electron index.js -e ../tinberg-exp-mvr -d ../tinberg-dev-mvr-stdin
```
Currently the only supported additional `experiment` is [tinberg-exp-mvr](https://github.com/sofroniewn/tinberg-exp-mvr)
Currently the only supported additional `device` is [tinberg-dev-mvr-stdin](https://github.com/sofroniewn/tinberg-dev-mvr-stdin)

## License
MIT
