
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
/**
 * on click #addProject add new Project(title) to projects, update leftMenu, update projectView.
 * on click #addTask add new Task(title, type, date) to project[selectedIndex], update leftMenu, updateProject view.
 */


// Adding sample projects - to be fixed later.
projects.push(new Project("Buggy"));
projects.push(new Project("Plagiat detektor"));

projects[0].tasks.push(new Task("test"));