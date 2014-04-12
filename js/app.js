(function() {

    var grid = new Grid();
    grid.init('#grid', 4);
    $('#score').text(grid.getScore());


    $( 'body' ).keyup(function( event ) {
        switch ( event.keyCode ) {
            case 37:
                event.preventDefault();
                grid.moveLeft();
                break;
            case 38:
                event.preventDefault();
                grid.moveUp();
                break;
            case 39:
                event.preventDefault();
                grid.moveRight();
                break;
            case 40:
                event.preventDefault();
                grid.moveDown();
                break;
        }
        $('#score').text(grid.getScore());
    });

})();