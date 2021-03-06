var RequestCache = require('../helpers/RequestCache')

    // Helper function that tries to humanize an error
  , msgToString = function (msg) {
      if(typeof msg == 'object' && msg instanceof 'Error')
        return msg.toString();

      if(typeof msg == 'object')
        return JSON.stringify(msg);

      return msg.toString();
    }

    // Enhances the response object with helpful properties
  , enhanceErrorResp = function (resp, msg, code) {
      resp.status = code || resp.statusCode;
      resp.response = msgToString(msg);
      return resp;
    }

    // A simple request cache
  , MAX_CACHE_SIZE = 20   // After this many items,
                          // the oldest accessed entry will be
                          // removed from the data structure
  , cache = new RequestCache(MAX_CACHE_SIZE)

  , Backbone_Ajax;

/**
* Why are we using browser-request here? Because using browser-request
* anywhere else in your app will clobber the XMLHttpRequest global
*
* See: https://github.com/iriscouch/browser-request/issues/21
*
* Will probably revisit in the future and go back to using jQuery.ajax,
* but for now, this method results in minimal headaches
*/
Backbone_Ajax = function (url, settings) {
  /**
  * jQuery.ajax has this weird function signature where url might be
  * a string, or a settings hash. The settings hash is then optional.
  *
  * Backbone will only send a settings hash as the first arg,
  * but we're going to be safe and handle the jQuery syntax too.
  */
  if(!settings) {
    settings = url;
  }
  else {
    settings.url = url;
  }

  var cacheSignature
    , cachedResp
    , errProxy
    , sucProxy;

  // This will be our "key" in the cache
  cacheSignature = {
    method: settings.type
  , target: settings.url
  , headers: settings.headers
  , params: settings.data
  };

  /**
  * See if the caller is expecting a cached response
  */
  if(settings.cache) {
    if(typeof settings.cache != 'function')
      throw new Error('The `cache` option should be `function (resp) {}`');

    // Check to see if this response is in the cache
    cachedResp = cache.get(cacheSignature);

    if(cachedResp !== false) {
      settings.cache(cachedResp);
    }
  }

  errProxy = settings.error;
  sucProxy = settings.success;

  settings.error = function (resp, textStatus, errorThrown) {
    errProxy(enhanceErrorResp(resp, errorThrown, 400));
  };
  settings.success = function (data, textStatus, resp) {
    cache.set(cacheSignature, data);
    return sucProxy(data);
  }

  $.ajax(settings);
};

module.exports = function (Backbone) {
  Backbone.ajax = Backbone_Ajax;
};
