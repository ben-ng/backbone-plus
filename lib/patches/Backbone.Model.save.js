var Proxied_Model_Save
  , Backbone_Model_Save
  , createSuccessCallback = require('../helpers/createSuccessCallback')
  , createErrorCallback = require('../helpers/createErrorCallback');

/**
* Patch Model.save to fit Node.js conventions
*/
Backbone_Model_Save = function (opts, cb) {
  if(!cb) {
    cb = opts;
    opts = {};
  }

  if(!cb)
    throw new Error('Model.save takes a Node.js style callback');

  opts = opts || {};

  opts.success = createSuccessCallback(cb);
  opts.error = createErrorCallback(cb);

  return Proxied_Model_Save.call(this, this.toJSON(), opts);
};

module.exports = function (Backbone) {
  Proxied_Model_Save = Backbone.Model.prototype.save;
  Backbone.Model.prototype.fetch = Backbone_Model_Save;
};
