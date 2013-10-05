requirejs.config({
    paths: {
        quest: "../patrol_0",
	rooms: "../patrol_0/rooms",
    }
});
require(
    ["jquery", "jquery.mobile", "jquery.touchy.min", "game", "quest/main"],
    function( $, mobile, game ){
        game.start();
    }
);
