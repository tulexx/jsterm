// document.querySelector('body').onlo
var terminal = document.getElementById('terminal');
var prompt = 'guest@' + 'tulexx.pl'; //document.locaton.hostname;
var currentFolder = '/home/guest';
var termInput, ps1;

var commands = {
    cat: null,
    cd: null,
    clear: clear,
    echo: null,
    help: help,
    ls: ls,
    man: null,
    mkdir: null,
    ps: null,
    pwd: null,
    rm: null,
    touch: touch,
    whoami: null,
};

var filesystem = {
    '/': {
        home: {
            guest: {
                'test.txt': 'This is a test document',
            },
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
        var cmd = old.split(' ');
        if (checkCommands(cmd[0])) {
            if (commands[cmd[0]]) {
                commands[cmd[0]](cmd[1]);
            }
            ready();
        } else if (old == '') {
            ready();
        } else {
            var p = document.createElement('p');
            p.innerHTML = 'Invalid command \"' + old + '\"' + '<br>' + 'type \"help\" for more information';
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

function clear() {
    terminal.innerHTML = null;
}

function help() {
    var output = document.createElement('p');
    output.innerHTML = '';

    for (var command in commands) {
        //showing only the commands that are implemented
        output.innerHTML += commands[command]?command + '<br>':'';
    }

    terminal.appendChild(output);
}

function ls(folder) {
    var output = document.createElement('p');
    var files = listFiles(currentFolder);

    if (folder) {
        if (folder == '/') {
            files = filesystem['/'];
        } else {
            folderArray = folder.split('/');
            if (folderArray.length == 1) {
                if (files[folderArray[0]]) {
                    files = files[folderArray[0]];
                } else {
                    files = null;
                    output.innerHTML = "ls: cannot access '" + folder + "': No such file or directory";
                }
            } else {
                files = listFiles(folder);
            }
        }
    } 

    for (var file in files) {
        var span = document.createElement('span');
        span.innerHTML = file;
        span.style.marginRight = '20px';
        output.appendChild(span);
    }

    terminal.appendChild(output);
}

function listFiles(folder) {
    var curr = folder.split('/');
    var files = filesystem['/'][curr[1]];

    for (var i=2; i<curr.length;i++) {
        files = files[curr[i]];
    }

    return files
}

function touch (file) {
    if (file) {
        var curr = listFiles(currentFolder);
        if (!curr[file]) {
            curr[file] = null;
        }
    } else {
        var output = document.createElement('p');
        output.innerHTML = "touch: missing file operand";
        terminal.appendChild(output);
    }
}
