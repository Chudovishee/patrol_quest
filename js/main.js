requirejs.config({
    paths: {
        quest: "../patrol_0",
	rooms: "../patrol_0/rooms",
    }
});
require(
    ["jquery", "jquery.mobile", "game", "saves","quest/main"],
    function( $, mobile, game, saves ){
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() 
        {
            game.start();
        };  
        
    }
);
