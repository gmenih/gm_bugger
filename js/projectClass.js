
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