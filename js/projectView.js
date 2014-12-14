$("#tasksList").children().on("click", function(){
	$(this).animate({"width": 0, "height": 0, "visibility":"hidden"}, 320, "linear", function(){
		var task = $(this);
		var toast = $("<div>", {"text": "Item removed. Undo", "class":"toastMessage"});

		toast.appendTo(".appContent");
		var removalTimer = setTimeout(function(){
			toast.animate({"opacity": 0}, 420, "linear", function(){
				toast.remove();
				task.remove();
			})
		}, 5000);
		toast.on("click", function(){
			clearTimeout(removalTimer);
			toast.animate({"opacity":0}, 420, "linear");
			task.animate({"width": "90%", "height":"50pt", "visibility":"visible"}, 320, "linear");
		})
	});
})