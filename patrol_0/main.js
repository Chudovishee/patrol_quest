define(
    ["jquery", "game",
	"quest/items",
        "quest/monsters",
	"quest/battles",
	"rooms/start",
	"rooms/tower",
	"rooms/wasteland",
	"rooms/sea",
	"rooms/ship",
	"rooms/snake",
	"rooms/cave"
    ],
    function($, game){
	game.startRoom = "start";
	return{};
    }
);
