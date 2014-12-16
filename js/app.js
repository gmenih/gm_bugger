var diskdb = require('diskdb');

var db = diskdb.connect('C:/Users/Grega/Documents/Gbase', ['projects']);

/**
 * List of existing projects.
 * @type {Array}
 */
var projects = db.projects.find();

/**
 * ID of the element selected in the leftMenuList
 * @type {string}
 */
var selectedId = null;

// fill menu with exsisting projects
projects.forEach(addProjectToMenu);

// when item in menu is clicked
$("#leftMenuList").on("click", ".leftMenuItem", function() {
		// if no item is selected yet
		if (selectedId == null) {
			$("#menuItemSelector").css("visibility", "visible");
			$(".noContent").css("visibility", "hidden");
			$(".projectView").css("visibility", "visible");
		} else {
			$(".menuItemSelected").removeClass("menuItemSelected");
		}
		var clicked = $(this);
		selectedId = clicked.attr("id");
		$("#menuItemSelector").css("top", clicked.position().top);
		clicked.addClass("menuItemSelected");
		var project = db.projects.findOne({
			"_id": selectedId
		});
		updateProjectView(project);
	})
	// add project
$("#addProject").on("click", function() {
	if (selectedId == null) {
		$(".noContent").css("visibility", "hidden");
		$(".projectView").css("visibility", "visible");
	}
	var project = {
		title: "Neimenovan projekt",
		tasks: [],
		finishedTasks: []
	};
	var pTitle = $("#projectTitle").hide();
	var cTitle = $("#changeTitle").hide();
	var titleEdit = $("<input>", {
		"type": "text",
		"value": project.title,
		"class": "titleEdit"
	}).prependTo(".titleRow .titleRowLeft");
	titleEdit.select();
	titleEdit.on("keyup", function(e) {
		if (e.keyCode == 13) {
			if (selectedId == null) {
				$("#menuItemSelector").css("visibility", "visible");
			}
			project.title = titleEdit.val();
			var saved = db.projects.save(project);
			var menuItem = addProjectToMenu(saved);
			pTitle.show().text(saved.title);
			cTitle.show();
			titleEdit.remove();
			$("#menuItemSelector").css("top", menuItem.position().top)
			menuItem.addClass("menuItemSelected");
		} else if (e.keyCode == 27) {
			pTitle.show();
			cTitle.show();
			titleEdit.remove();
			if (selectedId != null) {
				updateProjectView(db.projects.findOne({
					_id: selectedId
				}));
			} else {
				$(".noContent").css("visibility", "visible");
				$(".projectView").css("visibility", "hidden");
				$("#menuItemSelector").css("visibility", "hidden");
			}
		}
	})
})

$("#changeTitle").on("click", function() {
	var pTitle = $("#projectTitle").hide();
	var cTitle = $("#changeTitle").hide();
	var titleEdit = $("<input>", {
		"type": "text",
		"value": pTitle.text(),
		"class": "titleEdit"
	}).prependTo(".titleRow .titleRowLeft");
	titleEdit.select();
	titleEdit.on("keyup", function(e) {
		if (e.keyCode == 13) {
			var updated = db.projects.update({
				_id: selectedId
			}, {
				title: titleEdit.val()
			});
			if (updated.updated == 1) {
				pTitle.text(titleEdit.val());
				$("#" + selectedId).text(titleEdit.val());
			}
			pTitle.show();
			cTitle.show();
			titleEdit.remove();
		} else if (e.keyCode == 27) {
			pTitle.show();
			cTitle.show();
			titleEdit.remove();
		}
	})
})

$("#addTask").on("click", function() {
	var d = new Date();
	var dateString = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
	var task = {
		title: "New task",
		type: "todo",
		date: dateString
	};
	// this is messy.. angularJs imba
	var taskItemDate = $("<div>", {"class":"taskItemRow", "html": $("<span>", {"class":"taskDate", "text": task.date})});
	var taskItemRow = $("<div>", {"class":"taskItemRow"});
	var taskType = $("<span>", {"class":"taskType", "text":task.type}).appendTo(taskItemRow);
	var taskTitleEdit = $("<input>", {"type":"text", "value":task.title, "class":"taskTitleEdit"}).appendTo(taskItemRow);
	var taskItemLeft = $("<div>", {"class":"taskItemLeft", "html":taskItemRow});
	taskItemLeft.append(taskItemDate);
	var taskItem = $("<div>", {"class":"taskItem", "html":taskItemLeft});
	taskItem.append('<div class="taskItemRight"><div class="taskFinish"><div class="b1"></div><div class="b2"></div></div></div>');
	$("#addTask").after(taskItem);
	taskTitleEdit.select();
	taskTitleEdit.on("keyup", function(e){
		if(e.keyCode == 13){
			var title = taskTitleEdit.val();
			task.title = title;
			var taskTitle = $("<span>", {"class":"taskTitle", "text":task.title}).appendTo(taskItemRow);
			taskTitleEdit.remove();
			var currItem = db.projects.findOne({_id: selectedId});
			db.projects.update({_id : selectedId}, { tasks: [task].concat(currItem.tasks)});
		}
	});
})

function updateProjectView(project) {
	$("#projectTitle").text(project.title);
}

function addProjectToMenu(project) {
	var menuItem = $("<li>", {
		"text": project.title,
		"data-notification": project.tasks.length,
		"id": project._id,
		"class": "leftMenuItem"
	});
	// add item
	menuItem.appendTo("#leftMenuList");
	return menuItem;
}