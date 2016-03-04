var _ = require('lodash');

exports.isStatic = isStatic;
exports.handleOnlyOption = handleOnlyOption;
exports.handleExceptOption = handleExceptOption;
exports.remoteMethods = remoteMethods;
/**
 * handleOnlyOption
 *
 * @param {[String]} all all available remote methods
 * @param {[String]} wanted the remote methods will be exposed
 * @returns {[String] } a list of remote methods need to be disabled
 */
function handleOnlyOption (all, wanted) {
  return _.difference(all, wanted);
};

/**
 * handleExceptOption
 *
 * @param {[String]} all all available remote methods
 * @param {[String]} unwanted the remote methods will not be exposed
 * @returns {[String] } a list of remote methods need to be disabled
 */
function handleExceptOption (all, unwanted) {
  return _.filter(all, function(method){
      return _.includes(unwanted, method);
  });
};

/**
 * remoteMethods
 *
 * @param {Model} Model loopback model
 * @returns {[String]} all available remote methods of the model
 */
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

/**
 * isStatic
 *
 * @param {string} method remoteMethod name
 * @returns {Boolean} indicate whether the method is static or not
 */
function isStatic (method) {
  return !/^prototype\./.test(method);
}
