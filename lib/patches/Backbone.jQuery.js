var $ = require('jquery-browserify')
  , touchswipe = require('touchswipe');

module.exports = function (Backbone) {
  touchswipe($);

	Backbone.$ = $;
};
