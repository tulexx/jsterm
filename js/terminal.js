// document.querySelector('body').onlo
var terminal = document.getElementById('terminal');
var prompt = 'guest@' + 'tulexx.pl'; //document.locaton.hostname;
var folder = '~';

document.querySelector('#topBar span').innerHTML = prompt;

var termInput = document.createElement('input');
termInput.id = 'termInput';
termInput.type = 'text';
var ps1 = document.createElement('span');
ps1.innerHTML = prompt + ':' + folder + '$ ';

terminal.appendChild(ps1);
terminal.appendChild(termInput);
