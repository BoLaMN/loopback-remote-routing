var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

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

  var methods = remoteMethods(Model);

  if (options.only && options.only.length) {
    methods = handlerOnlyOption(methods, options.only);
  }

  if (options.except && options.except.length) {
    methods = handleExceptOption(methods, options.except);
  }

  methods.forEach(function(method){
    if (/^@/.test(method)) {
      Model.disableRemoteMethod(method.replace(/^@/, ''), true);
    } else {
      Model.disableRemoteMethod(method, false);
    }
  });
}

function handlerOnlyOption (all, wanted) {
  return _.difference(all, wanted);
}

function handleExceptOption (all, unwanted) {
  return _.filter(all, function(method){
      return _.includes(unwanted, method);
  });
}


function remoteMethods (Model) {
  return Model.app.handler('rest').adapter.allRoutes().filter(function(route) {
    return route.method.split('.')[0] === Model.modelName;
  }).map(function(route) {
    var method = route.method.split('.').slice(1).join('.');

    if (isStatic(method)) {
      method = ['@', method].join('');
    } else {
      method = method.replace(/^prototype\./, '');
    }
    return method;
  });
}

function isStatic (method) {
  return !/^prototype\./.test(method);
}

