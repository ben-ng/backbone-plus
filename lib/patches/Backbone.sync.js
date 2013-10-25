var Proxied_Sync
  , Backbone_Sync;

/**
* We've patched this to default to CORS JSON requests
*/
Backbone_Sync = function(method, model, options) {
  options = options || {};

  options.timeout = options.timeout || 20000;
  options.parse = options.parse || true;
  options.dataType = 'json';
  options.headers = options.headers || {};

  if(!options.headers.Accept)
    options.headers.Accept = {'Accept': 'application/json'};

  if (!options.crossDomain) {
    options.crossDomain = true;
  }

  return Proxied_Sync(method, model, options);
};

module.exports = function (Backbone) {
  Proxied_Sync = Backbone.sync;
  Backbone.sync = Backbone_Sync;
};
