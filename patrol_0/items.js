define(
    ["jquery", "game"],
    function($,game){
	game.addItems([
	    {tag: "superPower", name:"Всенагибалка", description: "Всенагибающая суперпалка.", stackable: false},
	    {tag: "rope", name:"Веревка", description: "Кусок крепкой веревки. 100500 метров.", stackable: false, icon: "item-icon-rope"},
	    {tag: "light", name:"Фонарь", description: "Большой кусок фонаря. Светит!", stackable: false, icon: "item-icon-light"},
	    {tag: "sword", name:"Меч", description: "Меч дозорного.", stackable: false, icon: "item-icon-sword"},
	    {tag: "amulet", name:"Амулет дозорного", description: "Вы чувствуете себя как в стальной броне, даже если на вас только этот амулет.", stackable: false, icon: "item-icon-amulet"},
	    {tag: "key", name:"Ключ", description: "Ключ. снятый с шеи убитого беса.", stackable: false, icon: "item-icon-key"},
	]);
	return {};
    }
); 
