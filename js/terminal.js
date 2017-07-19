// document.querySelector('body').onlo
var terminal = document.getElementById('terminal');
var prompt = 'guest@' + 'tulexx.pl'; //document.locaton.hostname;
var termInput, ps1;
var currentFolder = '/home/guest'

var commands = {
    cat: null,
    cd: null,
    clear: clear,
    echo: echo,
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
                folder: {},
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
        var fullCommand = old.split(' ');
        var cmd = [fullCommand.shift(), fullCommand.join(' ')];
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
    var cmd = termInput.value;
    executed.innerHTML = cmd;

    termInput.parentNode.removeChild(termInput);

    terminal.appendChild(executed);
    terminal.appendChild(document.createElement('br'));

    return cmd.trim();
}

function ready() {
    ps1 = document.createElement('span');

    ps1.innerHTML = prompt + ':';
    ps1.innerHTML += currentFolder == '/home/guest' ? '~' : currentFolder;
    ps1.innerHTML += '$ ';
    ps1.id = 'ps1';

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

function echo(parameters) {
    var files = listFiles(currentFolder);
    var split = parameters.split('>>');
    var text = '';
    var file = null;

    if (split.length != 1) {
        text = split[0].trim();
        file = split[1].trim().split(' ')[0];
        if (file in files) {
            var tmp = files[file];
            tmp += '<br>' + text;
            files[file] = tmp;
        } else {
            touch(file);
            files[file] = text;
        }
    } else {
        split = parameters.split('>');
        if (split.length != 1) {
            text = split[0].trim();
            file = split[1].trim().split(' ')[0];
            files[file] = text;
        } else {
            var output = document.createElement('p');
            output.innerHTML = parameters;
            terminal.appendChild(output);
        }
    }
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
    var dir = workingFolder(folder);

    if (dir[0]) {
        if (isObject(dir[0])) {
            for (var file in dir[0]) {
                var span = document.createElement('span');
                span.innerHTML = file;
                span.style.marginRight = '20px';
                output.appendChild(span);
            }
        } else {
            output.innerHTML = dir[1];
        }
    } else {
        output.innerHTML = "ls: cannot access '" + folder + "': No such file or directory";
    }

    terminal.appendChild(output);
}

function listFiles(folder) {
    var directories = [];
    var files = [];
    //folderArray[0] will be nothing
    var folderArray = folder.split('/');
    var list = filesystem['/'];

    if (folderArray.length !== 1) {
        for (var i=1; i<folderArray.length;i++) {
            list = list[folderArray[i]];
        }
    }

    for (var li in list) {
        if (isObject(li)) {
            directories.push(li);
        } else {
            files.push(li);
        }
    }

    return directories.concat(files);
}

function mkdir (folder) {
    var folderArray = folder.split('/');



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

function isObject(val) {
    if (val === null) { 
        return false; 
    }

    return ((typeof val === 'function') || (typeof val === 'object'));
}

function workingFolder(folder) {
    var objFolder = filesystem['/']['home']['guest'];
    var strFolder = '/home/guest/';
    var folderArray = [];
    var counter = 3;

    if (folder) {
        folderArray = folder.split('/');
    } else {
        folderArray = currentFolder.split('/');
    }

    if (folderArray[folderArray.length - 1] == '') {
        folderArray.pop();
        folder = folder.slice(0, -1);
    }

    if (folderArray.length > 1) {
        if (folderArray[0] == '') {
            objFolder = filesystem['/'];
            strFolder = '/';
            counter = 1;
        } else if (folderArray[0] == '~') {
            folderArray.shift();
            folderArray = currentFolder.split('/').concat(folderArray);
        }
    } else {
        if (folderArray[0] != '~') {
            if (folderArray[0] != '') {
                folderArray = currentFolder.split('/');
                folderArray.push(folder);
            }

            objFolder = filesystem['/'];
            strFolder = '/';
            counter = 1;
        }
    }


    for (counter; counter < folderArray.length; counter++) {
        var node = folderArray[counter];
        objFolder = objFolder[folderArray[counter]];
        strFolder += node + '/';
        if (!isObject(objFolder)) {
            break;
        }
    }

    strFolder = strFolder.length > 1 ? strFolder.slice(0, -1) : '/';

    return [objFolder, strFolder];
}
