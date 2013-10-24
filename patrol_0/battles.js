define(
    ["jquery", "jquery.touchy.min", "game"],
    function($, touchy, game){
	var Hero = {
		hitPoints: 10
	}

	/// actionObject = 
	//  {
	// 	  type: "swipe"/"rotate"/"pinch"/"drag",
	// 	  success: function(data){},
	//    error: function(){},
	//    timeToCatch: milliseconds
	/// }
	function Action(options)
	{
		this.type = options.type;
		this.success = (typeof options.success === "function") ? options.success : null;
		this.error = (typeof options.error === "function") ? options.error : null;
		this.timeToCatch = options.timeToCatch;
	}

	Action.prototype.startCapturing = function(options)
	{
		var self = this;
		var actionElement = $("#page");

		var timeoutId = setTimeout(function(){
				actionElement.unbind("touchy-" + self.type);
				options.error();
			}, this.timeToCatch);

		switch(this.type)
		{
			case "swipe":
				actionElement.bind('touchy-swipe', function(event, target, data){
					clearTimeout(timeoutId);
					options.success({
						event: event,
						target: target,
						data: data
					});
					actionElement.unbind("touchy-" + self.type);
				});
				break;
			case "rotate":
				actionElement.bind('touchy-rotate', function(event, phase, target, data){
					//$("#content").append(data.degreeDelta)
					if(Math.abs(data.degreeDelta) > 180)
					{
						clearTimeout(timeoutId);
						options.success({
							event: event,
							phase: phase,
							target: target,
							data: data
						});
						actionElement.unbind("touchy-" + self.type);
					}
				});
				break;
			case "pinch":
				actionElement.bind('touchy-pinch', function(event, target, data){
					clearTimeout(timeoutId);
					options.success({
						event: event,
						target: target,
						data: data
					});
					actionElement.unbind("touchy-" + self.type);
				});
				break;
			case "drag":
				actionElement.bind('touchy-drag', function(event, phase, target, data){
					clearTimeout(timeoutId);
					options.success({
						event: event,
						phase: phase,
						target: target,
						data: data
					});
					actionElement.unbind("touchy-" + self.type);
				});			
				break;
			default: throw new Error("Unsupported action type");
		}
	}

	function Battle(options)
	{
		this.actions = (options.actions) ? options.actions : [];
		this.onStart = function(){
			if(typeof options.onStart === "function")
				options.onStart();
		}
		this.onEnd = function(){
			self.actions = $.extend(true, {}, self.finishedActions);
			self.finishedActions = [];

			if(typeof options.onEnd === "function")
				options.onEnd();
		}
		this.finishedActions = [];
	}

	Battle.prototype.addAction = function(actionObect)
	{
		this.actions.push(actionObect);

		return this;
	}

	Battle.prototype.start = function()
	{
		this.onStart();
		this.captureNextAction();

		return this;
	}
	Battle.prototype.captureNextAction = function()
	{
		var self = this;
		var currentAction = this.actions.shift();
		this.finishedActions.push(currentAction);

		currentAction.startCapturing({
			success: function(data)
			{
				currentAction.success(data);
				if(self.actions.length > 0)
				{
					self.captureNextAction();
				}
				else self.onEnd();
			},
			error: function()
			{
				currentAction.error();
				self.actions.unshift(currentAction);
				self.finishedActions.pop();

				if(Hero.hitPoints > 0)
					self.captureNextAction();
				else self.onEnd();
			}
		});

		return this;
	}
    }
);
