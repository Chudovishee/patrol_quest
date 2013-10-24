define("saves", ["jquery"], function( $ ){ return {
	path: "saves.dat",
	crypt: "none",
	load: function()
	{
		this._processFileSystem("load");

	    return this;
	},
	save: function(data)
	{
		this._processFileSystem("save", data);

	    return this;	
	},
	_processFileSystem: function(action, data)
	{
		var self = this;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function(fileSystem){
				self._gotFS(fileSystem, action, data);
			},
			function(error){
				self._fail(error);
			});

	},
	_gotFS: function(fileSystem, action, data)
	{
		var self = this;
		var isCreatable = (action == "save") ? true : false;
        fileSystem.root.getFile(this.path, {create: isCreatable, exclusive: false}, 
        	function(fileEntry){
        		self._gotFileEntry(fileEntry, action, data);
        	},
        	self._fail);
    },
	_gotFileEntry: function(fileEntry, action, data)
	{
		var self = this;
		switch(action)
		{
			case "save":
				fileEntry.createWriter(
					function(writer){
						self._gotFileWriter(writer, data);
					}, self._fail);
				break;
			case "load":
				fileEntry.file(
					function(file){
						self._gotFile(file);
					}, self._fail);
				break;
			default:
				throw Error("saves module error: unsupported action type '" + action + "'");
		}
	},
	_gotFileWriter: function(writer, data, self) 
    {
    	var self = this;
        writer.onwriteend = function(evt) 
        {
        	self._success(evt);
        }
    	writer.write(JSON.stringify(data));
	},
	_gotFile: function(file)
	{
		var self = this;
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            self._success(JSON.parse(evt.target.result));
        };
        reader.readAsText(file);
    },
	setCryptMethod: function(method)
	{
		switch(method)
		{
			default: this.crypt = "none";
		}

		return this;
	},
	setPath: function(path)
	{
		this.path = path;

		return this;
	},
	_success: function(){

	},
	_fail: function(error){

	},
	success: function(callback)
	{
		if(typeof callback == "function")
			this._success = callback;

		return this;
	},
	fail: function(callback)
	{
		if(typeof callback == "function")
			this._fail = callback;

		return this;
	},
};}); 