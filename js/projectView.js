var hiddenTasks = []; // list of hidden tasks not yet removed
/*
 * Hides a task on click, then starts a timer which
 * displays a toast message for 5 seconds before fully removing
 * the task.
 */
$("#tasksList").children().on("click", function(){
	$(this).hide(420, function(){
		var toast; // toast message
		hiddenTasks.push(this); // add clicked task to array
		if($("#undoTaskRemove") !== "undefined"){ // if toast not yet displayed, make it happen
			toast = $("<div>", {"text": "Item removed. Undo", "class":"toastMessage", "id":"undoTaskRemove"});
			toast.appendTo(".appContent")
		}
		var removalTimer = timerSetup(toast); // start timer
		toast.on("click", function(){ // if toast message clicked
			clearTimeout(removalTimer); // restart timer
			removalTimer = timerSetup(toast);
			// show last task
			$(hiddenTasks[hiddenTasks.length - 1]).show(420);
			hiddenTasks.pop(); // remove last task from list
			if(hiddenTasks.length < 1){
				toast.remove();
				toast = null;
				clearTimeout(removalTimer);
			}
		})	
	});
})

/**
 * Timer function, which waits 5 seconds before finally removing all tasks in hiddenTasks array.
 */
function timerSetup(toast){
	return setTimeout(function(){
		console.log("after", toast);
		toast.animate({"opacity": 0}, 420, "linear", function(){
			toast.remove();
			hiddenTasks.forEach(function(task){
				task.remove();
			})
		})
	}, 5000);
}