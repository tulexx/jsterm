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
    help: help,
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

terminal.addEventListener('keydown', enter);
terminal.addEventListener('click', function() {
    termInput.focus();
});

function enter(e) {
    if (e.which == 13 || e.keyCode == 13) {
        var old = executedCommand();
        if (checkCommands(old)) {
            if (commands[old]) {
                commands[old]();
            }
            ready();
        } else if (old == '') {
            ready();
        } else {
            var p = document.createElement('p');
            p.innerHTML = 'Invalid command \"' + old + '\"' + '<br>' + 'type \"help\" for more information';
            p.style.margin = 0;
            terminal.appendChild(p);

            ready();
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

function executedCommand() {
    var executed = document.createElement('span');
    executed.innerHTML = termInput.value;

    termInput.parentNode.removeChild(termInput);

    terminal.appendChild(executed);
    terminal.appendChild(document.createElement('br'));

    return executed.innerHTML.trim();
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
    termInput.focus();
}

function help() {
    var output = document.createElement('p');
    output.innerHTML = '';
    output.style.margin = 0;

    for (var command in commands) {
        output.innerHTML += command + '<br>';
    }

    terminal.appendChild(output);
}
