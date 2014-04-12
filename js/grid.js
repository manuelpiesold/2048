function Grid() {
    var grid     = undefined,
        gridElem = undefined,
        gridSize = undefined,

        gridScore      = 0,
        defaultGridVal = '&thinsp;',

        nothing    = function(){},
        beforeMove = nothing,
        afterMove  = nothing
    ;

    var setGridValues = function( val ) {
        var gridObj = [];
        for (var y=0; y<gridSize; y++) {
            gridObj[y] = [];
            for (var x=0; x<gridSize; x++) {
                gridObj[y][x] = val;
            };
        };
        return gridObj;
    };
    var rotate = function( orgGrid ) {
        newGrid = setGridValues( defaultGridVal );
        for (var y=gridSize-1, nX=0; y>=0; y--, nX++) {
            for (var x=0; x<gridSize; x++) {
                newGrid[x][nX] = orgGrid[y][x];
            };
        };
        return newGrid;
    };

    var initGrid = function( elem, size ) {
        gridElem = elem || '#grid';
        gridSize = size || 4;
        grid = setGridValues( defaultGridVal );
        insertNew();
        insertNew();
        drawGrid( gridElem, grid );
    };

    var recalcGrid = function() {
        for ( var y=0; y<gridSize; y++ ) {
            grid[y] = recalcRow( grid[y] );
        };
    };
    var recalcRow = function( row ) {
        for ( var n=gridSize-1; n>0; n-- ) {
            var c=n, d=n;
            while ( c>=0 ) {
                if ( row[n-1] === defaultGridVal ) {
                    row[n-1] = row[n];
                    row[n] = defaultGridVal;
                } else if ( row[n-1] === row[n] ) {
                    row[n-1] *= 2;
                    gridScore+=row[n-1];
                    row[n] = defaultGridVal;
                    c=0;
                    n-=2;
                }
                c--;
            }
        }

        return row;
    };

    var drawGridOrig = function( gridElem, grid ) {
        var rootElem = $(gridElem);
        rootElem.empty();
        for (var y=0; y<gridSize; y++) {
            rootElem.append('<div data-row="'+y+'"></div>');
            rowElem = rootElem.find( 'div[data-row="'+y+'"]' );
            for (var x=0; x<gridSize; x++) {
                var val = grid[y][x] || '';
                rowElem.append('<div data-val="'+val+'">'+val+'</div>');
            };
        };
    };
    var drawGrid = drawGridOrig;

    var isSpace = function() {
        for (var y=0; y<gridSize; y++) {
            for (var x=0; x<gridSize; x++) {
                if ( grid[y][x] === defaultGridVal ) { return true; };
            };
        };
        return false;
    };
    var insertNew = function() {
        var randomCoord = function() {
            return Math.floor(Math.random() * 4) + 0;
        };

        var calcCoord = true, x, y;
        while ( calcCoord ) {
            x = randomCoord();
            y = randomCoord();
            if ( grid[x][y] === defaultGridVal ) { calcCoord = false; }
        }

        grid[x][y] = 2;
        gridScore+=2
    }

    var move = function( direction ) {
        var after = 4, before = 0;
             if ( direction === 'up' )    { before = 3; }
        else if ( direction === 'right' ) { before = 2; }
        else if ( direction === 'down' )  { before = 1; }
        else if ( direction === 'left' )  { before = 0; }
        after-=before;

        gridBefore = grid;

        beforeMove();
        for ( var i=0; i<before; i++ ) { grid = rotate( grid ); }

        recalcGrid();

        if ( isSpace() ) { insertNew(); }
        else {
            console.log('game over! no, maybe you can move..?');
        }

        for ( var i=0; i<after; i++ ) { grid = rotate( grid ); }

        drawGrid( gridElem, grid );
        afterMove();
    }



    return {
        init: initGrid,

        moveUp:    function() { move( 'up'    ); },
        moveRight: function() { move( 'right' ); },
        moveDown:  function() { move( 'down'  ); },
        moveLeft:  function() { move( 'left'  ); },

        setBeforeMoveCallback: function(cb) { beforeMove = cb; },
        setAfterMoveCallback:  function(cb) { afterMove  = cb; },

        setDrawFunction:   function(drawGridFunc) { drawGrid = drawGridFunc; },
        resetDrawFunction: function()             { drawGrid = drawGridOrig; },

        getScore: function() { return gridScore; }
    };
}

