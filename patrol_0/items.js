define(
    ["jquery", "game"],
    function($,game){
	game.items = {
	    "superPower":{name:"Всенагибалка", description: "Всенагибающая суперпалка.", stackable: false},
	    "rope":{name:"Веревка", description: "Кусок крепкой веревки. 100500 метров.", stackable: false, icon: "item-icon-rope"},
	    "light":{name:"Фонарь", description: "Большой кусок фонаря. Светит!", stackable: false, icon: "item-icon-light"},
	    "sword":{name:"Меч", description: "Меч дозорного.", stackable: false, icon: "item-icon-sword"},
	    "amulet":{name:"Амулет дозорного", description: "Вы чувствуете себя как в стальной броне, даже если на вас только этот амулет.", stackable: false, icon: "item-icon-amulet"},
	    "key":{name:"Ключ", description: "Ключ. снятый с шеи убитого беса.", stackable: false, icon: "item-icon-key"},
	};
	return {};
    }
); 
