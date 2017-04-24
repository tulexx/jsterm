var Drag = function (id) {
    var el = document.getElementById(id);
    var topBar = el.querySelector('#topBar');
    var dragging = false;
    var pos = {
        x: 0,
        y: 0
    };

    topBar.addEventListener('mousedown', function (event) {
        dragging = true;
        pos.x = event.pageX - el.offsetLeft;
        pos.y = event.pageY - el.offsetTop;
    });

    document.addEventListener('mousemove', function (event) {
        if (dragging) {
            el.style.left = (event.pageX - pos.x) + 'px';
            el.style.top = (event.pageY - pos.y) + 'px';
        }

    });

    document.addEventListener('mouseup', function () {
        dragging = false;
    });
};

var Size = function (id) {
    var el = document.getElementById(id);
    var terminal = el.querySelector('#terminal');
    var resizing = false;
    var pos = {
        x: 0,
        y: 0
    };
    var minWidth = parseInt(getComputedStyle(el).width.slice(0,-2));
    var minHeight = parseInt(getComputedStyle(el).height.slice(0,-2));

    document.addEventListener('mousemove', function (e) {
        var direction = checkCursor(e);
        if (direction && resizing) {
            switch (direction) {
                case 'ew':
                    var offset = e.pageX - pos.x;
                    var size = minWidth + offset;
                    var width = (minWidth < size ? size : minWidth) + 'px';
                    el.style.width = width;
                    console.log(width);

                    
                    break;
                
                default:
                    
            }


        }
    });

    terminal.addEventListener('mousedown', function (e) {
        resizing = true;
        pos.x = e.pageX;
        pos.y = e.pageY;
        // el.style.width = minWidth + 'px';
    });

    document.addEventListener('mouseup', function () {
        resizing = false;
    });

    var checkCursor = function (event) {
        var leftBorder = el.offsetLeft;
        var rightBorder = el.offsetLeft + el.clientWidth;
        var bottomBorder = el.offsetTop + el.clientHeight;

        var direction = '';

        //left corner
        if ((Math.abs(event.pageX - leftBorder) < 4)
                && (Math.abs(event.pageY - bottomBorder) < 4)) {
            direction = 'ne';
        //right corner
        } else if ((Math.abs(event.pageX - rightBorder) < 4)
                && (Math.abs(event.pageY - bottomBorder) < 4)) {
            direction = 'nw';
        //bottom border
        } else if (Math.abs(event.pageY - bottomBorder) < 4) {
            direction = 'ns';
        //left border
        } else if (Math.abs(event.pageX - leftBorder) < 4 ) {
            direction = 'ew';
        //right border
        } else if (Math.abs(event.pageX - rightBorder) < 4){
            direction = 'ew';
        //default
        } else {
            direction = '';
        }

        cursor(direction);

        return direction;
    }

    var cursor = function (direction) {
        if (direction) {
            document.body.style.cursor = direction + '-resize';
        } else {
            document.body.style.cursor = 'default';
        }
    };
};
