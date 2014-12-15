var hiddenTasks = []; // list of hidden tasks not yet removed
/*
 * Hides a task on click, then starts a timer which
 * displays a toast message for 5 seconds before fully removing
 * the task.
 */
 var removalTimer;
 console.log("someid", $("#someId").length);
 $("#tasksList").children().on("click", function(){
 	$(this).hide(420, function(){
		var toast; // toast message
		hiddenTasks.push(this); // add clicked task to array
		if($("#undoTaskRemove").length === 0){ // if toast not yet displayed, make it happen
			toast = $("<div>", {"text": "Item removed. Undo", "class":"toastMessage", "id":"undoTaskRemove"});
			toast.appendTo(".appContent")
			console.log("Toast message sent.");
		}
		removalTimer = timerSetup(toast); // start timer
	});
 })
$(".appContent").on("click", "#undoTaskRemove", function(){ // if toast message clicked
			clearTimeout(removalTimer); // restart timer
			removalTimer = timerSetup(this);
			// show last task
			$(hiddenTasks[hiddenTasks.length - 1]).show(420);
			hiddenTasks.pop(); // remove last task from list
			if(hiddenTasks.length < 1){
				$(this).remove();
				clearTimeout(removalTimer);
			}
		})	
/**
 * Timer function, which waits 5 seconds before finally removing all tasks in hiddenTasks array.
 */
 function timerSetup(toast){
 	return setTimeout(function(){
 		console.log("after", toast);
 		$(toast).animate({"opacity": 0}, 420, "linear", function(){
 			$(toast).remove();
 			hiddenTasks.forEach(function(task){
 				task.remove();
 			})
 		})
 	}, 5000);
 }

 $("#changeTitle").on("click", function(){
 	var projectTitle = $("#projectTitle");
 	var editButton = $(this);
 	projectTitle.hide();
 	editButton.hide();
 	var titleEdit = $("<input>", 
 		{"type":"text", 
 		"value":projects[selectedIndex].title, 
 		"class":"titleEdit"}).prependTo($(this).parent());
 	titleEdit.focus().select();
 	titleEdit.on("keyup", function(e){
 		if(e.keyCode == 13){
 			projects[selectedIndex].title = titleEdit.val();
 			titleEdit.remove();
 			projectTitle.text(projects[selectedIndex].title).show();
 			editButton.show();
 			$("#leftMenuList").children().eq(selectedIndex).text(projects[selectedIndex].title);
 		}
 	})
 });