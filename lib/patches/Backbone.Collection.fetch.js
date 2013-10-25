var Proxied_Collection_Fetch
  , Backbone_Collection_Fetch
  , createSuccessCallback = require('../helpers/createSuccessCallback')
  , createErrorCallback = require('../helpers/createErrorCallback');


Backbone_Collection_Fetch = function (opts, cb) {
  var self = this;

  if(!cb) {
    cb = opts;
    opts = {};
  }

  if(!cb)
    throw new Error('Collection.fetch takes a Node.js style callback');

  opts = opts || {};

  opts.success = createSuccessCallback(cb);
  opts.error = createErrorCallback(cb);
  opts.cache = function (resp) {
    self.trigger('cacheRead', resp);
  };

  return Proxied_Collection_Fetch.call(this, opts);
}

module.exports = function (Backbone) {
  Proxied_Collection_Fetch = Backbone.Collection.prototype.fetch;
  Backbone.Collection.prototype.fetch = Backbone_Collection_Fetch;
};
