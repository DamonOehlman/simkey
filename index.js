/* jshint node: true */
'use strict';

/**
  # simkey

  A simple key event dispatcher.  Written primarily to help with testing
  other modules that deal with key events.

  ## Example Usage

  <<< examples/simple.js

**/
module.exports = function(target, opts, code) {

  var modifiers = ['ctrl', 'alt', 'shift', 'meta'];

  function dispatchKey(c) {
    var evt = document.createEvent('KeyboardEvent');

    (evt.initKeyboardEvent || evt.initKeyEvent).call(
      evt,
      opts.type || 'keydown',
      true, // bubbles
      true, // cancelable
      document.defaultView, // viewArg: should be window
      opts.ctrl || opts.ctrlKey,
      opts.alt || opts.altKey,
      opts.shift || opts.shiftKey,
      opts.meta || opts.metaKey,
      c, // keyCodeArg : unsigned long the virtual key code, else 0
      c // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
    );

    modifiers.forEach(function(modifier) {
      Object.defineProperty(evt, modifier + 'Key', {
        get: function() {
          return opts[modifier] || opts[modifier + 'Key'] || false;
        }
      })
    })

    Object.defineProperty(evt, 'keyCode', {
      get: function() {
        return c;
      }
    });

    Object.defineProperty(evt, 'which', {
      get: function() {
        return c;
      }
    });

    setTimeout(function() {
      target.dispatchEvent(evt);
    }, 0);
  }

  // if we have no opts, but have been passed a simple value as opts
  // then remap args
  if (typeof opts != 'undefined' && typeof opts != 'object' && (! (opts instanceof String))) {
    code = opts;
  }

  // ensure we have opts
  opts = opts || {};

  // if we haven't been provided a code, return the dispatch key function
  if (typeof code == 'undefined') {
    return dispatchKey;
  }

  return dispatchKey(code);
};