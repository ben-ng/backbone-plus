# Backbone-Plus

## The Goal
To make developing web and mobile apps with Backbone + Browserify easy and predictable, without treading into opinionated framework territory.

## The 30-Second Changelog
 * Comes with `jquery-browserify` out of the box
 * `Backbone.ajax` caches responses to speed up initial view renders
    * Also patched to avoid conflict with `browser-request`
    * Defaults to `Accept: application/json`, CORS

```js
// Using caching to improve perceived performance
var myView = Backbone.view.extend({
  initialize: function () {
    var self = this;

    this.collection = new Things();

    /**
    * If a cached response is available, `cacheRead` will trigger
    */
    this.listenToOnce(this.collection
      , 'cacheRead', function (resp) {
        // Parse the response and update the collection
        self.collection.set(self.collection.parse(resp));
        self.render();
      });

    /**
    * Perform a fetch.
    * Note: Even if a cached response was found, the request
    * will still happen, and this callback will still fire.
    */
    this.collection.fetch(function (err) {
      if(err) return alert(err);

      self.stopListening(self.collection, 'cacheRead')

      self.render();
    });
  }
});
```


 * Better error handling in `.save` and `.fetch`
    * Non - 200, 201, 204 status codes are intepreted as errors
    * More meaningful error messages (Assumes `message` key in server response)
 * `.save` and `.fetch` now follow node callback conventions

```js
// Previously:
myModel.save({attr: 'changeMe'}, {
  success: function () {}
, error: function () {}
, headers: {}
});

// Now:
myModel.save(function (err) {
  // etc
});

// Or with options:
myModel.save({
  headers: {}
}, function (err) {
  // etc
});
```

## Todo
 * Drop-in compatability with canonical Backbone to make onboarding easier

## License
The MIT License (MIT)

Copyright (c) 2013 Ben Ng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
