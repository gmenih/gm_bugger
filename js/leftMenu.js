
var projects = new EventedArray();


projects.on("add", function(item)
{
	var elem = $("<li>", {"text": item.title, "data-notifications": item.getNot(), "class":"leftMenuItem"});
	$("#leftMenuList").append(elem);
	console.log(item);
	console.log("Menu item", item.title, "added.");
	item.tasks.on("add", function(task){
		elem.attr("data-notifications", item.getNot());
		console.log("Task", task.title, "added.");
	})
});
projects.push(new Project("Buggy"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
projects.push(new Project("Plagiat detektor"));
var selectedIndex = -1;

$("#leftMenuList").children().on("click", function(){
	if(selectedIndex < 0){
		$("#menuItemSelector").css("visibility", "visible");
	} else {
		$(".menuItemSelected").removeClass("menuItemSelected");
	}
	selectedIndex = $("#leftMenuList").children().index(this);
	$(this).attr("data-notifications", projects[selectedIndex].getNot()); 
	console.log("Selected index set to", selectedIndex);
	$("#menuItemSelector").css("top", $(this).position().top);
	$(this).addClass("menuItemSelected");
	$(".noContent").remove();
	$("#projectTitle").text(projects[selectedIndex].title)
})
projects[0].tasks.push(new Task("test"));

$("#addTask").on("click", function(){
	projects[selectedIndex].tasks.push(new Task("t1"));
})