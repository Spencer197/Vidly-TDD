const helmet  = require('helmet');
const compression = require('compression');

module.exports = function(app) {//The app object installs the following middleware pieces.
    app.use(helmet());//These apps are functions we must call to get a middleware function
    app.use(compression());
}