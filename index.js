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

  function dispatchKey(c) {
    var evt;
    var haveKeyboardEvent = typeof KeyboardEvent != 'undefined';
    var initKeyEvent = haveKeyboardEvent && KeyboardEvent.prototype.initKeyEvent;

    // if we have an initKeyEvent then we are likely in firefox
    // which is a little fussier than chrome these days
    if (typeof initKeyEvent == 'function') {
      evt = document.createEvent('KeyboardEvent');
      initKeyEvent.call(
        evt,
        opts.type || 'keydown',
        true,
        true,
        document.defaultView,
        opts.ctrl || opts.ctrlKey,
        opts.alt || opts.altKey,
        (opts || {}).shift || false,
        (opts || {}).meta || false,
        (opts.type || 'keydown') === 'keydown' ? c : 0,
        (opts.type || 'keydown') === 'keypress' ? c : 0
      );
    }
    // otherwise if we have a KeyboardEvent structure then create that
    else if (haveKeyboardEvent) {
      evt = new KeyboardEvent(opts.type || 'keydown', {
        ctrlKey: opts.ctrl || opts.ctrlKey,
        altKey: opts.alt || opts.altKey
      });

      Object.defineProperty(evt, 'keyCode', {
        get: function() {
          return c;
        }
      });
    }
    // otherwise, fall back to very old school implementations
    else {
      evt = document.createEvent('KeyboardEvent');
      (evt.initKeyboardEvent || evt.initKeyEvent).call(
        evt,
        opts.type || 'keydown',
        true, // bubbles
        true, // cancelable
        document.defaultView, // viewArg: should be window
        opts.ctrl || opts.ctrlKey, // ctrlKeyArg
        (opts || {}).alt || false, // altKeyArg
        (opts || {}).shift || false, // shiftKeyArg
        (opts || {}).meta || false, // metaKeyArg
        c, // keyCodeArg : unsigned long the virtual key code, else 0
        c // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
      );
    }

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