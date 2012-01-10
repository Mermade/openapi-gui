$(function() {
	$('.endpointActuator').click(function(actuator) {
		var actuator = event.target;
		var id = actuator.id.replace("endpointActuator","");
		var div = $('#ep' + id);
		
		if(div.is(":visible"))
			return;
		
		$('.endpoint').hide();
		
		//show the div
		$('#ep' + id).show();
	})
});