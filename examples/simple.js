var simkey = require('..');

document.body.addEventListener('keydown', function(evt) {
  console.log('received key code: ' + evt.keyCode);
});

// simulate a keypress on the document body
simkey(document.body, 65);

// simulate a number of keypress using simkey's partial application
[65, 68].forEach(simkey(document.body));