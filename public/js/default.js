$(function() {
	$('.endpointActuator').click(function(actuator) {
		var actuator = event.target;
		var id = actuator.id.replace("endpointActuator","");
		var div = $('#ep' + id);
		
		//if the clicked div is already showing, do nothing
		if(div.is(":visible"))
			return;
		
		//hide all divs
		$('.endpoint').hide();
		
		//show the div corresponding to what was clicked
		$('#ep' + id).show();
	})
});