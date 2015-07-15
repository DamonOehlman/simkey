var simkey = require('..');
var input = document.createElement('input');

document.body.appendChild(input);

input.addEventListener('keydown', function(evt) {
  console.log('key down: ' + evt.keyCode);
});

input.addEventListener('keyup', function(evt) {
  console.log('key up: ', evt.keyCode);
});

// simulate a keypress on the document body
simkey(input, 65);

// simulate a number of keypress using simkey's partial application
[65, 68]
  .map(simkey(input))
  .map(simkey(input, { type: 'keyup' }));