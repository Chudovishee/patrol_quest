define("game", ["jquery", "jquery.cookie"], function( $ ){ return {
    version: "game_base",
    
    
    content: $("#content"),
    page: $("#page"),
       
    startRoom: false,
    startInventory:[],
    items:{},
    monsters:{},
    rooms: {},
    
    currentRoom: false,
    activeRooms:{},
    activeMonsters:{},
    inventory:[],
    
    pickupQueue:[],
    
    
    
    //start reset load save
    reset: function(){
	this.currentRoom = this.startRoom;
	this.inventory = $.extend(true, [], this.startInventory);
	this.activeRooms = $.extend(true, {}, this.rooms);
	this.activeMonsters = $.extend(true, {}, this.monsters);
    },
    start: function(){
	//reset and start new game
	this.reset();
	this.enterRoom( this.startRoom );
    },
    
    save: function(){
	var data = JSON.stringify({
	    version: this.version,
	    currentRoom: this.currentRoom,
	    activeRooms: this.activeRooms,
	    activeMonsters: this.activeMonsters,
	    inventory: this.inventory,
	    pickupQueue: this.pickupQueue
	});
	$.cookie("test", data);
    },
    load: function(){
	var data = JSON.parse( $.cookie("test") );
	if( data && (data.version == this.version) ){
	    this.reset();
	    
	    this.currentRoom = data.currentRoom;
	    
	    $.extend(true, this.activeRooms, data.activeRooms);
	    $.extend(true, this.activeMonsters, data.activeMonsters);
	    
	    for(var i = 0; i < data.inventory.length; i++){
		var item = this.items[ data.inventory[i].item ];
		if(item){
		    this.inventory.push({
			item: item,
			count: data.inventory[i].count
		    });
		}
	    }
	    for(var i = 0; i < data.pickupQueue.length; i++){
		var item = this.items[ data.pickupQueue[i].item ];
		if(item){
		    this.pickupQueue.push({
			item: item,
			count: data.pickupQueue[i].count
		    });
		}
	    }
	    this.enterRoom( this.currentRoom, true );
	}
	else{
	    this.start();
	}
    },
    
        
    //rooms
    addRoom: function(name, room){
	var baseRoom = {
	    dialog: [],
	    states:[],
	    entry: 0,
	    toJSON: function(){
		var replacement = {};
		for (var val in this){
		    switch(val){
			case "dialog":
			case "states":
			    break;
			default:
			    replacement[val] = this[val];
			    break;
		    }
		}
		return replacement;
	    }
	};
	this.rooms[name] = $.extend(baseRoom, room);
    },
    
	
    
    enterRoom: function(name, isLoad){
	var room = this.activeRooms[name];
	
	if(!isLoad){
	    room.entry++;
	}
	this.currentRoom = name;
	
	
	for(var i = 0; i < room.states.length; i++){
	    if( this.checkRequest(room.states[i].request, room) ){
		
		this.content.html( room.states[i].text );
		if( !isLoad && typeof room.states[i].enter == "function"){
		    room.states[i].enter();
		}
		
		break;
	    }
	}
	
	
	//save game stage
	if(!isLoad){
	    this.save();
	}
	
	this.displayPickup();
	
	
	this.content.append(this.dialog = $('<div data-role="controlgroup"></div>'));
	
	for(var i = 0; i < room.dialog.length; i++){
	    if( this.checkRequest(room.dialog[i].request) ){
		this.dialog.append(
		    $("<a data-role=\"button\">" + room.dialog[i].text + "</a>").click( this.selectDialog(this, room.dialog[i].select) )
		);
	    }
	}
    
	this.page.trigger( "create" );
	$(window).scrollTop(0);
	
    },

    
    
    //
    checkRequest: function(request,room){
	if(!request){
	    return true;
	}
	else if(typeof request == "function"){
	    return request.apply(room,arguments);
	}
	else{
	    var r = request.split(":",3);
	    switch(r[0]){
		case "item":
		    var f = this.findItem(r[1]);
		    if( f >= 0 ){
			if( (r[2] === undefined) || (this.inventory[f].count >= r[2]) ){
			    return true;
			}
		    }
		    break;
		case "nitem":
		    if( this.findItem(r[1]) == -1 ) return true;
		    break;
		case "kill":
		    if( this.hasKills(r[1]) ) return true;
		    break;
		case "nkill":
		    if( !this.hasKills(r[1]) ) return true;
		    break;
		case "entry":
		    if(r[1] == "this"){
			if(r[2] == room.entry) return true;
		    }
		    else if( this.activeRooms[r[1]] ){
			if(r[2] == this.activeRooms[r[1]].entry) return true;
		    }
		    break;
	    }
	}
	return false;
    },

    selectDialog: function(self, select){return function(){
	if(typeof select == "function"){
	    return select.call(self);
	}
	else{
	    var s = select.split(":",3);
	    switch(s[0]){
		case "enter":
		    return self.enterRoom(s[1]);
		    break;
		case "useAndEnter":
		    self.removeItem(s[1]);
		    return self.enterRoom(s[2]);
		    break;
		case "startgame":
		    self.start();
		    break;
	    }
	}
	return false;
    }},
    
    
    //inventory
    
    addItem: function(data){
	var base = {
	    tag: "base_tag",
	    name:"Предмет",
	    description: "",
	    stackable: false,
	    toJSON: function(){
		return this.tag;
	    }
	};
	$.extend(base, data);
	this.items[base.tag] = base;
    },
    addItems: function(data){
	for(var i = 0; i < data.length; i++){
	    this.addItem(data[i]);
	}
    },
    
    findItem: function(tag){
	for(var i = 0; i < this.inventory.length; i++){
	    if(tag === this.inventory[i].item.tag)
		return i;
	}
	return -1;
    },
    pickup: function(tag, count){
	if( !count || (count <= 0) ){
	    count = 1;
	}
	if(this.items[tag].stackable){
	    var i = this.findItem(tag);
	    if(i >= 0 ){
		this.inventory[i].count += count;
	    }
	    else{
		this.inventory.push({
		    item: this.items[tag],
		    count: count
		});
	    }
	}
	else{
	    this.inventory.push({
		item: this.items[tag],
		count: 1
	    });
	}
	this.pickupQueue.push({
	    item: this.items[tag],
	    count: count
	});
    },
    removeItem: function(tag, count){
	if( !count || (count <= 0) ){
	    count = 1;
	}
	var f = this.findItem(tag);
	if(f >= 0){
	    if( this.inventory[f].count >= count ){
		this.inventory[f].count -= count;
		if(this.inventory[f].count == 0){
		    this.inventory.splice(f,1);
		}
		return true;
	    }
	}
	return false;
    },

    displayItem: function(item, count){
	return "<div class=\"item\"><span class=\"item-icon " + item.icon + "\"/>" + item.name + "</div>";
    },
    
    displayPickup: function(){
	if(this.pickupQueue.length > 0){
	    this.content.append("<br/>Вы нашли:");
	}
	for(var i = 0; i < this.pickupQueue.length; i++){
	    this.content.append( this.displayItem(this.pickupQueue[i].item, this.pickupQueue[i].count) );
	}
	this.pickupQueue = [];
    },
    
      //monsters
    
    addMonster: function(data){
	var base = {
	    tag: "base_tag",
	    name:"Монстр",
	    description: "",
	    kills: 0,
	    losses: 0,
	    toJSON: function(){
		var replacement = {};
		for (var val in this){
		    switch(val){
			case "tag":
			case "name":
			case "description":
			    break;
			default:
			    replacement[val] = this[val];
			    break;
		    }
		}
		return replacement;
	    }
	};
	$.extend(base, data);
	this.monsters[base.tag] = base;
    },
    addMonsters: function(data){
	for(var i = 0; i < data.length; i++){
	    this.addMonster(data[i]);
	}
    },
    
    kill: function(tag){
	this.activeMonsters[tag].kills++;
    },
    hasKills: function(tag){
	if( this.activeMonsters[tag].kills > 0 ) return true;
	return false;
    },
    
    
    
};}); 
