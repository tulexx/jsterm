// document.querySelector('body').onlo
var terminal = document.getElementById('terminal');
var user = 'guest';
var hostname = document.location.hostname;
var prompt = user + '@' + hostname;
var termInput, ps1;
var currentFolder = '/home/guest'

var commands = {
    cat: cat,
    cd: cd,
    clear: clear,
    echo: echo,
    help: help,
    ls: ls,
    man: null,
    mkdir: mkdir,
    pwd: pwd,
    rm: rm,
    touch: touch,
    whoami: whoami,
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
    ps1.innerHTML += currentFolder.includes('/home/guest') ? currentFolder.replace('/home/guest','~') : currentFolder;
    ps1.innerHTML += '$ ';
    ps1.id = 'ps1';

    termInput = document.createElement('input');
    termInput.id = 'termInput';
    termInput.type = 'text';

    terminal.appendChild(ps1);
    terminal.appendChild(termInput);
    termInput.focus();
}

function cat(parameter) {
    if (parameter) {
        var file = workingFolder(parameter)[0];
        if (file) {
            if (!isObject(file)) {
                display(file);
            } else {
                error("cat: " + parameter + ": Is a directory");
            }
        } else {
            error("cat: " + parameter + ": No such file or directory");
        }
    }
}

function cd(folder) {
    if (!folder) {
        folder = '~';
    } else if (folder == '..') {
        folder = currentFolder.split('/');
        folder.pop();
        folder = folder.join('/');
    }

    var dir = workingFolder(folder);

    if (dir[0]) {
        if (isObject(dir[0])) {
            currentFolder = dir[1];
        } else {
            error("cd: " + folder + ": Not a directory");
        }
    } else {
        error("cd: " + folder + ": No such file or directory");
    }
}

function clear() {
    terminal.innerHTML = null;
}

function echo(parameters) {
    var folder = workingFolder(currentFolder)[0];
    var split = parameters.split('>>');
    var text = '';
    var file = null;

    if (split.length > 1) {
        text = split[0].trim();
        file = split[1].trim().split(' ')[0];
        if (file in folder) {
            var tmp = folder[file];
            tmp += '<br>' + text;
            folder[file] = tmp;
        } else {
            touch(file);
            folder[file] = text;
        }
    }
     else {
        split = parameters.split('>');
        if (split.length > 1) {
            text = split[0].trim();
            file = split[1].trim().split(' ')[0];
            if (!(file in folder)) {
                touch(file);
            }
            folder[file] = text;
        } else {
            display(parameters);
        }
    }
}

function help() {
    var text = '';

    for (var command in commands) {
        //showing only the commands that are implemented
        text += commands[command]?command + '<br>':'';
    }

    display(text);
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

function mkdir(folder) {
    var objFolder = workingFolder(currentFolder)[0];
    var folderArray = folder.split('/');

    if (folderArray.length > 1) {
        folder = folderArray.pop();
        objFolder = workingFolder(folderArray.join('/'))[0];
    }

    if (objFolder[folder]) {
        error("mkdir: cannot create directory '" + folderArray.join('/') + folder + "': File exists");
    } else {
        objFolder[folder] = null;
    }
}

function touch(parameter) {
    if (!parameter) {
        error("touch: missing file operand");
        return;
    }

    var folder = workingFolder(currentFolder)[0];
    var split = parameter.split('/');
    var file = '';

    if (split.length > 1) {
        file = split.pop();
        folder = workingFolder(split.join('/'))[0];
    } else {
        file = parameter;
    }

    if (!folder[file]) {
        folder[file] = null;
    }
}

function rm(parameters) {
    var dirBlock = true;
    var folder = null;
    var file = null;
    var toDelete = null;
    parameters = parameters.split(' ');

    if (parameters.length > 1) {
        if (parameters[0].trim() == '-r') {
            dirBlock = false;
        }
        folder = parameters[1].trim();
    } else {
        folder = parameters[0].trim();
    }

    folder = folder.split('/');
    file = folder.pop();
    folder = folder.join('/');
    folder = workingFolder(folder);

    toDelete = folder[0][file];

    if (toDelete) {
        if ((isObject(toDelete) && !dirBlock) || !isObject(toDelete)) {
            delete folder[0][file];
        } else {
            error("rm: cannot remove '" + folder[1] + "/" + file  + "': Is a directory");
        }
    } else {
        error("rm: cannot remove '" + folder[1] + "/" + file + "': No such file or directory");
    }
}

function pwd() {
    display(currentFolder);
}

function whoami() {
    display(user);
}

function display(input) {
    var output = document.createElement('p');
    output.innerHTML = input;
    terminal.appendChild(output);
}

var error = display;

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
