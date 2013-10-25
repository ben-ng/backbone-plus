/**
* Creates a node.js style callback
*/
module.exports = function (cb) {
  return function (model, resp) {
    cb(null, resp);
  };
};
