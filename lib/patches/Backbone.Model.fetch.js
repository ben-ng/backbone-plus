var Proxied_Model_Fetch
  , Backbone_Model_Fetch
  , createSuccessCallback = require('../helpers/createSuccessCallback')
  , createErrorCallback = require('../helpers/createErrorCallback');


Backbone_Model_Fetch = function (opts, cb) {
  var self = this;

  if(!cb) {
    cb = opts;
    opts = {};
  }

  if(!cb)
    throw new Error('Model.fetch takes a Node.js style callback');

  opts = opts || {};

  opts.success = createSuccessCallback(cb);
  opts.error = createErrorCallback(cb);
  opts.cache = function (resp) {
    self.trigger('cacheRead', resp);
  };

  return Proxied_Model_Fetch.call(this, opts);
}

module.exports = function (Backbone) {
  Proxied_Model_Fetch = Backbone.Model.prototype.fetch;
  Backbone.Model.prototype.fetch = Backbone_Model_Fetch;
};
