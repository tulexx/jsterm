// document.querySelector('body').onlo
var terminal = document.getElementById('terminal');
var prompt = 'guest@' + 'tulexx.pl'; //document.locaton.hostname;
var currentFolder = '/home/guest'
var termInput, ps1;

var commands = {
    cat: null,
    cd: null,
    clear: null,
    echo: null,
    help: null,
    ls: null,
    man: null,
    mkdir: null,
    ps: null,
    pwd: null,
    rm: null,
    touch: null,
    whoami: null,
};

var filesystem = {
    '/': {
        home: {
            guest: null,
        },
    },
};

document.querySelector('#topBar span').innerHTML = prompt;

ready();

var input = terminal.querySelector('input')
input.focus();

terminal.addEventListener('keydown', enter);

function enter(e) {
    if (e.which == 13 || e.keyCode == 13) {
        var old = oldCommand();
        if (checkCommands(input.value)) {
            console.log('jest komenda');
            ready();
            input = terminal.querySelector('input')
            input.focus();
        } else if (old == '') {
            ready();
            input = terminal.querySelector('input')
            input.focus();
        } else {
            var p = document.createElement('p');
            p.innerHTML = 'Invalid command \"' + old + '\"' + '<br>' + 'type \"help\" for more information';
            p.style.margin = 0;
            terminal.appendChild(p);

            ready();
            input = terminal.querySelector('input')
            input.focus();
        }
    }
}

function checkCommands(cmd) {
    for (var command in commands) {
        if (cmd == command) {
            return command;
        }
    }
    return false;
}

function oldCommand() {
    var executed = document.createElement('span');
    executed.innerHTML = input.value;

    input.parentNode.removeChild(input);

    terminal.appendChild(executed);
    terminal.appendChild(document.createElement('br'));

    return executed.innerHTML;
}

function ready() {
    ps1 = document.createElement('span');

    ps1.innerHTML = prompt + ':';
    ps1.innerHTML += currentFolder == '/home/guest' ? '~' : currentFolder;
    ps1.innerHTML += '$ ';

    termInput = document.createElement('input');
    termInput.id = 'termInput';
    termInput.type = 'text';

    terminal.appendChild(ps1);
    terminal.appendChild(termInput);
}

function cat() {

}

