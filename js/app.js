var diskdb = require('diskdb');
/**
 * Connection to database file.
 * @type {[type]}
 */
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

var selectedProject = null;

// fill menu with exsisting projects
projects.forEach(addProjectToMenu);

// when item in menu is clicked
$("#leftMenuList").on("click", ".leftMenuItem", function() {
		// if no item is selected yet
		if (selectedId == null) {
			// make selector visible, hide noContent, show projectView
			$("#menuItemSelector").css("visibility", "visible");
			$(".noContent").css("visibility", "hidden");
			$(".projectView").css("visibility", "visible");
		} else {
			// else remove class from currently selected item
			$(".menuItemSelected").removeClass("menuItemSelected");
		}
		var clicked = $(this);
		selectedId = clicked.attr("id");
		$("#menuItemSelector").css("top", clicked.position().top);
		clicked.addClass("menuItemSelected");
		selectedProject = db.projects.findOne({
			"_id": selectedId
		});
		updateProjectView(selectedProject);
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
	$("#tasksList").empty();
	titleEdit.select();
	titleEdit.on("keyup blur", function(e) {
		console.log(e);
		if (e.keyCode == 13 || e.type === "blur") {
			if (selectedId == null) {
				$("#menuItemSelector").css("visibility", "visible");
			}
			project.title = titleEdit.val();
			var saved = db.projects.save(project);
			var menuItem = addProjectToMenu(saved);
			pTitle.show().text(saved.title);
			cTitle.show();
			titleEdit.remove();
			$("#menuItemSelector").css("top", menuItem.position().top);
			$(".menuItemSelected").removeClass("menuItemSelected");
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
	var taskItemDate = $("<div>", {
		"class": "taskItemRow",
		"html": $("<span>", {
			"class": "taskDate",
			"text": task.date
		})
	});
	var taskItemRow = $("<div>", {
		"class": "taskItemRow"
	});
	var taskType = $("<span>", {
		"class": "taskType",
		"text": task.type
	}).appendTo(taskItemRow);
	var taskTitleEdit = $("<input>", {
		"type": "text",
		"value": task.title,
		"class": "taskTitleEdit"
	}).appendTo(taskItemRow);
	var taskItemLeft = $("<div>", {
		"class": "taskItemLeft",
		"html": taskItemRow
	});
	taskItemLeft.append(taskItemDate);
	var taskItem = $("<div>", {
		"class": "taskItem",
		"html": taskItemLeft,
		"id": "taskId" + (selectedProject.tasks.length)
	});
	taskItem.append('<div class="taskItemRight"><div class="taskFinish"><div class="b1"></div><div class="b2"></div></div></div>');
	$("#tasksList").prepend(taskItem);
	taskTitleEdit.select();
	taskTitleEdit.on("keyup", function(e) {
		if (e.keyCode == 13) {
			console.log("triggered keyCode", e.keyCode)
			var title = taskTitleEdit.val();
			task.title = title;
			var taskTitle = $("<span>", {
				"class": "taskTitle",
				"text": task.title
			}).appendTo(taskItemRow);
			taskTitleEdit.remove();
			var updated = db.projects.update({
				_id: selectedId
			}, {
				tasks: [task].concat(selectedProject.tasks)
			});
			console.log("updated status:", updated);
			$("#" + selectedId).attr("data-notifications", selectedProject.tasks.length + 1);
			selectedProject = db.projects.findOne({
				_id: selectedId
			});
		} else if (e.keyCode == 27) {
			taskItem.remove();
		}
	});
})
var hiddenTasks = [];
var timeoutCounter = null;
$(".tasksList").on("click", ".taskItem", function() {
	var clickedTask = $(this);
	var taskIndex = $(this).attr("id").replace("taskId", "");
	hiddenTasks.push({
		element: clickedTask,
		id: taskIndex
	})
	clickedTask.animate({
		"width": "0",
		"border-width": "0"
	}, 420, "linear", function() {
		$(this).animate({
			"height": "0"
		}, 580);
	});
	var toast = showToast("Task hidden. Click to undo.");
	if (timeoutCounter != null)
		clearTimeout(timeoutCounter);
	timeoutCounter = initTimer(toast);
})
$(".appContent").on("click", ".toastMessage", function() {
	var topElement = hiddenTasks[hiddenTasks.length - 1];
	hiddenTasks.pop();
	$("#taskId" + topElement.id).animate({
		"height": "50pt",
		"width": "90%",
		"border-width": "3pt"
	}, 420);
	if (hiddenTasks.length < 1) {
		$(this).remove();
		clearTimeout(timeoutCounter);
	} else {
		clearTimeout(timeoutCounter);
		timeoutCounter = initTimer(this);
	}
})

function initTimer(toast) {
	return setTimeout(function() {
		var cpTasks = selectedProject.tasks;
		hiddenTasks.forEach(function(task) {
			cpTasks.splice(task.id, 1);
			console.log("trying to remove id:", task.id);
			task.element.remove();
			db.projects.update({
				_id: selectedId
			}, {
				tasks: cpTasks
			});
			$("#" + selectedId).attr("data-notifications", cpTasks.length);
		})
		toast.remove();
	}, 5000);
}

function updateProjectView(project) {
	$("#projectTitle").text(project.title);
	$("#tasksList").empty();
	if (project.tasks.length > 0) {
		project.tasks.forEach(function(task, index) {
			console.log(index);
			var taskItemDate = $("<div>", {
				"class": "taskItemRow",
				"html": $("<span>", {
					"class": "taskDate",
					"text": task.date
				})
			});
			var taskItemRow = $("<div>", {
				"class": "taskItemRow"
			});
			var taskType = $("<span>", {
				"class": "taskType",
				"text": task.type
			}).appendTo(taskItemRow);
			var taskTitle = $("<span>", {
				"class": "taskTitle",
				"text": task.title
			}).appendTo(taskItemRow);
			var taskItemLeft = $("<div>", {
				"class": "taskItemLeft",
				"html": taskItemRow
			});
			taskItemLeft.append(taskItemDate);
			var taskItem = $("<div>", {
				"class": "taskItem",
				"html": taskItemLeft,
				"id": "taskId" + index
			});
			taskItem.append('<div class="taskItemRight"><div class="taskFinish"><div class="b1"></div><div class="b2"></div></div></div>');
			$("#tasksList").append(taskItem);
		})
	}
}

function addProjectToMenu(project) {
	var menuItem = $("<li>", {
		"text": project.title,
		"data-notifications": project.tasks.length,
		"id": project._id,
		"class": "leftMenuItem"
	});
	// add item
	menuItem.appendTo("#leftMenuList");
	return menuItem;
}

function showToast(message) {
	if ($(".toastMessage").length < 1)
		return $("<div>", {
			class: "toastMessage",
			text: message
		}).appendTo(".appContent");
	else
		return $(".toastMessage");
}