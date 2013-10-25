/**
* Creates a node.js style callback
*/
module.exports = function (cb) {
  return function (model, xhr) {
    var parsed
      , msg
      , err;

    /**
    * This tries to create the most useful error message
    * possible from the failed response, and stores it
    * in `msg`
    */
    try {
      if(!xhr.responseText)
        throw new Error('Response has no content');

      parsed = JSON.parse(xhr.responseText);
      msg = parsed.message || xhr.responseText;
    }
    catch (e) {
      msg = xhr.statusText;
    }

    /**
    * If `msg` is empty, or `msg == 'error'`, then
    * we failed to find something useful. In this case
    * we'll use an ugly but developer-friendly error.
    */
    if(!msg || msg == 'error')
      msg = xhr.status + ': ' + xhr.response;

    /**
    * We should return a real Error object
    */
    err = new Error(msg);

    err.code = xhr.status;
    err.xhr = xhr;

    cb(err);
  };
};
