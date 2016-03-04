var utils = require('./utils.js');

//options : {only: [], except: []}
//only: only expose specified methods, disable others
//except: expose all methods, except specified ones
//symbol @ donates the method is static

module.exports = function(Model, options) {
  Model.on('attached', function () {
    RemoteRouting(Model, options);
  })
};

function RemoteRouting(Model, options) {
  options = options || {};

  var methods = utils.remoteMethods(Model);

  if (options.only && options.only.length) {
    methods = utils.handlerOnlyOption(methods, options.only);
  }

  if (options.except && options.except.length) {
    methods = utils.handleExceptOption(methods, options.except);
  }

  methods.forEach(function(method){
    if (/^@/.test(method)) {
      Model.disableRemoteMethod(method.replace(/^@/, ''), true);
    } else {
      Model.disableRemoteMethod(method, false);
    }
  });
}

