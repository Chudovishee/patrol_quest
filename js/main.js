requirejs.config({
    paths: {
        quest: "../patrol_0",
	rooms: "../patrol_0/rooms",
    }
});
require(
    ["jquery", "jquery.mobile", "game", "quest/main"],
    function( $, mobile, game ){
        game.start();
    }
);
