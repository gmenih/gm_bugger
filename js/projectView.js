var hiddenTasks = [];
$("#tasksList").children().on("click", function(){
	$(this).animate({"width": 0, "height": 0, "visibility":"hidden"}, 320, "linear", function(){
		hiddenTasks.push($(this));
		var toast = $("<div>", {"text": "Item removed. Undo", "class":"toastMessage"});

		toast.appendTo(".appContent");
		var removalTimer = timerSetup(toast);
		toast.on("click", function(){
			clearTimeout(removalTimer);
			removalTimer = timerSetup();
			toast.animate({"opacity":0}, 420, "linear");
			hiddenTasks[0].animate({"width": "90%", "height":"50pt", "visibility":"visible"}, 320, "linear");
			hiddenTasks.pop();

		})
	});
})

function timerSetup(){
	return setTimeout(function(toast){
		toast.animate({"opacity": 0}, 420, "linear", function(){
			toast.remove();
			hiddenTasks.foreach(function(task){task.remove();});
		})
	}, 5000);
}