var request = require('browser-request')
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

  var opts;

  /**
  * For whatever reason Backbone converts the JSON to be
  * sent into a string, so we need to turn it back into
  * an object for browser-request.
  */
  try {
    opts = {
      method: settings.type
    , url: settings.url
    , timeout: settings.timeout
    , headers: settings.headers
    , json: settings.data ? JSON.parse(settings.data) : true
    };
  }
  catch(e) {
    // Beware of Zalgo.. this is an async function, let's keep it that way
    setTimeout(function () {
      /**
      * At this point settings.error has been wrapped by backbone,
      * so it thinks the resp is going to be the first argument
      * even though we defined
      */
      settings.error(enhanceErrorResp(resp, 'The data to be sent could not be parsed', 400));
    }, 0);
    return;
  }

  request(opts, function (err, resp, body) {
    // See previous comment for why the resp is now the first argument
    if(err != null)
      return settings.error(enhanceErrorResp(resp, err, 400));
    else if(resp.statusCode != 200 && resp.statusCode != 201 && resp.statusCode != 204)
      return settings.error(enhanceErrorResp(resp, body.message));
    else
      return settings.success(body);
  });
};

module.exports = function (Backbone) {
  Backbone.ajax = Backbone_Ajax;
};
