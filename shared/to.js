module.exports = (promise) => promise.then((result) => [null, result]).catch((e) => [e])