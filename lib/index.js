var Backbone = require('backbone');

require('./patches/Backbone.jQuery')(Backbone);
require('./patches/Backbone.ajax')(Backbone);
require('./patches/Backbone.sync')(Backbone);
require('./patches/Backbone.Collection.fetch')(Backbone);
require('./patches/Backbone.Model.save')(Backbone);
require('./patches/Backbone.Model.fetch')(Backbone);

module.exports = Backbone;
