var heap = require('heap')
  , Cache
  , DEFAULT_MAX = 20
  , compareLastUsed
  , hashFromParams;

/**
* Returns < 0 if b is older than a
*/
compareLastUsed= function (a, b) {
  return b.lastUsed - a.lastUsed;
};

/**
* Computes a hash from an object
* @return false if it can't safely hash this object, a string otherwise
*/
hashFromParams = function (obj) {
  var buffer = [];

  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      buffer.push(key);

      if(typeof obj[key] != 'object') {
        buffer.push(obj[key]);
      }
      else {
        try {
          buffer.push(JSON.stringify(obj[key]));
        }
        catch(e) {
          return false;
        }
      }
    }
  }

  if(buffer.length == 0)
    return false;

  return buffer.join(':');
};

RequestCache = function (maxSize) {
  this.maxSize = maxSize || DEFAULT_MAX;
  this.maxHeap = new heap(compareLastUsed);
  this.requests = {};
};

/**
* @param params - A hash of the parameters used to make the request
* @param response - The response from the server
* @return true if cacheable, false otherwise
*/
RequestCache.prototype.set = function (params, response) {
  var hash = hashFromParams(params)
    , entry;

  // Return false if unhashable
  if(!hash)
    return false;

  // Check for an existing request
  if(this.requests[hash]) {
    this.requests[hash].response = response;
    this.requests[hash].lastUsed = (new Date()).getTime();
    this.maxHeap.updateItem(this.requests[hash]);
    return true;
  }

  // This is what the entries in our hashtable look like
  entry = {
    lastUsed: (new Date()).getTime()
  , response: response
  , hash: hash
  }

  // Add to the hashtable and our maxHeap
  this.requests[hash] = entry;
  this.maxHeap.push(entry);

  // Remove the oldest thing in the heap if we're over quota
  if(this.maxHeap.size() > this.maxSize) {
    delete this.requests[this.maxHeap.pop().hash];
  }

  return true;
};

/**
* @param params - A hash of the parameters used to make the request
* @return false if not in cache, the last response otherwise
*/
RequestCache.prototype.get = function (params) {
  var hash = hashFromParams(params);

  // Return false if unhashable
  if(!hash)
    return false;

  if(this.requests[hash] != null) {
    this.requests[hash].lastUsed = (new Date()).getTime();
    this.maxHeap.updateItem(this.requests[hash]);

    return this.requests[hash].response;
  }

  return false;
};

module.exports = RequestCache;
