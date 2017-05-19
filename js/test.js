var element = document.getElementById('termContainer');
var terminal = document.getElementById('terminal');
var topBar = document.getElementById('topBar');

var margins = 10;
var minWidth = 600;
var minHeight = 375;

var isMoving = false;
var isResizing = false;
var onRightEdge, onBottomEdge, onLeftEdge;
var bounds;

var position = {
    left: null,
    top: null,
    cursorX: null,
    cursorY: null,
    clientX: null,
    clientY: null,
};

topBar.addEventListener('mousedown', onTopBar)
terminal.addEventListener('mousedown', onTerminal);
document.addEventListener('mouseup', onUp);
document.addEventListener('mousemove', onMove);

function onTopBar(e) {
    e.preventDefault();
    calculate(e, element);

    isMoving = true;
}

function onTerminal(e) {
    calculate(e, element);
    isResizing = onRightEdge || onBottomEdge || onLeftEdge;
}

function onMove(e) {

    if (isMoving) {
        element.style.left = (position.left + e.clientX - position.clientX) + 'px';
        element.style.top = (position.top + e.clientY - position.clientY) + 'px';
        return
    }

    calculate(e, terminal);

    if (isResizing) {
        e.preventDefault();
        if (onRightEdge) {
            element.style.width = Math.max(e.clientX - position.left, 0) + 'px';
        }
        if (onBottomEdge) {
            element.style.height = Math.max(e.clientY - position.top, minHeight) + 'px';
        }
        if (onLeftEdge) {
            element.style.left = e.clientX + 'px';
            // element.style.width = bounds.width + 

        }
        return
    }

    //styling cursor
    if (onRightEdge && onBottomEdge) {
        element.style.cursor = 'nwse-resize';
    } else if (onLeftEdge && onBottomEdge) {
        element.style.cursor = 'nesw-resize';
    } else if (onRightEdge || onLeftEdge) {
        element.style.cursor = 'ew-resize';
    } else if (onBottomEdge) {
        element.style.cursor = 'ns-resize';
    } else {
        element.style.cursor = 'default';
    }
}

function onUp(e) {
    isMoving = false;
    isResizing = false;
}



function calculate(event, element) {
    bounds = element.getBoundingClientRect();

    position.left = bounds.left;
    position.top = bounds.top;
    position.cursorX = event.clientX - bounds.left;
    position.cursorY = event.clientY - bounds.top;
    position.clientX = event.clientX;
    position.clientY = event.clientY;

    onLeftEdge = position.cursorX < margins;
    onRightEdge = position.cursorX >= bounds.width - margins;
    onBottomEdge = position.cursorY >= bounds.height - margins;

}


