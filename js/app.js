/**
 * NodeJs requires.
 */
 var EventedArray = require("array-events");

/**
 * List of projects that the program contains and are displayed in the left menu.
 * @type {EventedArray}
 */
 var projects = new EventedArray();

/**
 * Index of currently selected item in the left menu.
 * @type {Number}
 */
 var selectedIndex = -1;

/**
 * Timer reference, to cancel removal timer, if items are restored.
 */
 var removalTimer;

/**
 * Tasks hidden from display.
 * @type {Array}
 */
 var hiddenTasks = [];
/**
 * Update left menu whenever an item is added to the projects array.
 * @param  {Project}
 * @return {void}
 */
 projects.on("add", function(item)
 {
	// constructed item menu element
	var elem = $("<li>", {"text": item.title, "data-notifications": item.getNotifications(), "class":"leftMenuItem"});
	// adding element to menuItemsList
	$("#leftMenuList").append(elem);
	console.log(item);
	console.log("Menu item", item.title, "added.");
	/**
	 * Event handler for adding a task to a project, to update the notification count (for now)
	 */
	 item.tasks.on("add", function(task){
	 	elem.attr("data-notifications", item.getNotifications());
	 	console.log("Task", task.title, "added.");
	 })
	});
/**
 * Update the project view, to show the currently selected projects,
 * whenever a project is clicked in the left menu.
 * @param  {[type]}
 * @return {void}
 */
 $("#leftMenuList").on("click", ".leftMenuItem", function(){
	//if selectedIndex isn't set yet, display the item selector
	if(selectedIndex < 0){
		$("#menuItemSelector").css("visibility", "visible");
		$(".projectView").css("visibility", "visible");
		$(".noContent").css("visibility", "hidden");
	} else {
		$(".menuItemSelected").removeClass("menuItemSelected");
	}
	// set index to index of clicked project
	selectedIndex = $("#leftMenuList").children().index(this);
	// update notification count for project (should I omit this, since it's set when adding projects?)
	$(this).attr("data-notifications", projects[selectedIndex].getNotifications()); 
	console.log("Selected index set to", selectedIndex);
	// move item selector to currently selected item
	$("#menuItemSelector").css("top", $(this).position().top);
	// make currently selected item prettys
	$(this).addClass("menuItemSelected");
	$("#projectTitle").text(projects[selectedIndex].title)
})

 $("#addProject").on("click", function(){
 	projects.push(new Project("Neimenovan projekt"));
 	$("#leftMenuList").children().eq(projects.length - 1).trigger("click");
 	$("#changeTitle").trigger("click");
 })
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
 		"class":"titleEdit", "maxlength": 32}).prependTo($(this).parent());
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


/* This could probably be removed and replaced with an Object */
 var Project = function(projectTitle)
 {
 	this.title = projectTitle;
 	this.tasks = new EventedArray();
 	this.finishedTasks = new EventedArray();
 }
/**
 * Adds a task to array of tasks.
 * @param {void}
 */
 Project.prototype.addTask = function(task)
 {
 	this.tasks.push(new Task("test"));
 }
/**
 * Returns the length of tasks, to display as notifications.
 * @return {int}
 */
 Project.prototype.getNotifications = function(){
 	return this.tasks.length;
 }

/**
 * Class for tasks.
 * @param {[type]}
 */
 var Task = function(taskTitle, taskType){
 	this.title = taskTitle;
 	this.type = taskType;
 }