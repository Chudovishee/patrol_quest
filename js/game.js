define("game", ["jquery"], function( $ ){ return {
    
    content: $("#content"),
    page: $("#page"),
       
    startRoom: false,
    startInventory:[],
    items:[],
    monsters:[],
    rooms: {},
    defaultRoomData:{ entry:0 },
    
    currentRoom: false,
    roomsData:{},
    inventory:[],
    
    pickupQueue:[],
    
        
    //rooms
    addRoom: function(name, room){
	var baseRoom = {
	    dialog: [],
	    data: false,
	};
	this.rooms[name] = $.extend(baseRoom, room);
    },
	
    
    enterRoom: function(name){
	var room = this.rooms[name];
	
	//init data link
	if( !room.data ){
	    if( !this.roomsData[name] ) this.roomsData[name] = $.extend(true,{},this.defaultRoomData);
	    room.data = this.roomsData[name];
	}
	
	room.data.entry++;
	this.currentRoom = name;
	
	
	for(var i = 0; i < room.states.length; i++){
	    if( this.checkRequest(room.states[i].request, room) ){
		
		this.content.html( room.states[i].text );
		if(typeof room.states[i].enter == "function")
		    room.states[i].enter();
		
		break;
	    }
	}
	this.displayPickup();
	this.pickupQueue = [];
	
	
	
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
    start: function(){
	//reset and start new game
	this.currentRoom = this.startRoom;
	this.inventory = $.extend(true, [], this.startInventory);
	this.roomsData = {};
	this.enterRoom( this.startRoom );
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
		    if( this.hasKill(r[1]) ) return true;
		    break;
		case "nkill":
		    if( !this.hasKill(r[1]) ) return true;
		    break;
		case "entry":
		    if(r[1] == "this"){
			if(r[2] == room.data.entry) return true;
		    }
		    else if( this.rooms[r[1]] ){
			if(r[2] == this.rooms[r[1]].data.entry) return true;
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
	    }
	}
	return false;
    }},
    
    
    //inventory
    findItem: function(tag){
	for(var i = 0; i < this.inventory.length; i++){
	    if(tag === this.inventory[i].tag)
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
	    if(i >=0 ){
		this.inventory[i].count+= count;
	    }
	    else{
		this.inventory.push({
		    tag: tag,
		    count: count
		});
	    }
	}
	else{
	    this.inventory.push({
		tag: tag,
		count: 1
	    });
	}
	this.pickupQueue.push({
	    tag: tag,
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
		    this.inventory[f] = false;
		}
		return true;
	    }
	}
	return false;
    },

    displayItem: function(tag, count){
	var item = this.items[tag];
	return "<div class=\"item\"><span class=\"item-icon " + item.icon + "\"/>" + item.name + "</div>";
    },
    
    displayPickup: function(){
	if(this.pickupQueue.length > 0){
	    this.content.append("<br/>Вы нашли:");
	}
	for(var i = 0; i < this.pickupQueue.length; i++){
	    this.content.append( this.displayItem(this.pickupQueue[i].tag, this.pickupQueue[i].count) );
	}
    },
    
      //monsters
    kill: function(tag){
	this.monsters[tag].kill++;
    },
    hasKill: function(tag){
	if( this.monsters[tag].kill > 0 ) return true;
	return false;
    },
    
    
    
};}); 
