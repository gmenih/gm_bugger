var EventedArray = require("./array-events");
var Project = function(projectTitle)
{
	this.title = projectTitle;
	this.tasks = new EventedArray();
	this.finishedTasks = new EventedArray();
}
Project.prototype.addTask = function(task)
{
	this.tasks.push(new Task("test"));
}
Project.prototype.getNot = function(){
	return this.tasks.length;
}
var Task = function(taskTitle){
	this.title = taskTitle;
}