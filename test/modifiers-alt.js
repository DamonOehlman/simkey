var crel = require('crel');
var test = require('tape');
var simkey = require('..');
var testTarget;

test('can create a test element', function(t) {
  t.plan(2);
  t.ok(testTarget = crel('div'), 'have test target');
  t.ok(testTarget instanceof HTMLElement, 'test target is a valid html element');
});

test('can simulate a keypress with a ctrl modifier in an element', function(t) {
  t.plan(2);

  testTarget.addEventListener('keydown', function handleKey(evt) {
    t.equal(evt.keyCode, 65, 'got expected keycode');
    t.ok(evt.altKey, 'altKey flag set');
    testTarget.removeEventListener('keydown', handleKey);
  });

  simkey(testTarget, { alt: true }, 65);
});

test('can perform partial application of simkey with ctrl modifier', function(t) {
  var keys = [65, 67];
  var sendKey;

  testTarget.addEventListener('keydown', function handleKey(evt) {
    t.equal(evt.keyCode, keys.shift(), 'got expected key in the expected order');
    t.ok(evt.altKey, 'altKey flag set');
    
    if (keys.length === 0) {
      testTarget.removeEventListener('keydown', handleKey);
    }
  });

  t.plan(keys.length * 2 + 1);
  sendKey = simkey(testTarget, { alt: true });
  t.equal(typeof sendKey, 'function', 'deferred execution of simkey');
  keys.forEach(sendKey);
});