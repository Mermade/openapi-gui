$(function() {
	$('.viewOutput').click(function(e){
		var formdata = form2js('config', '.');
		var json = syntaxHighlight(JSON.stringify(formdata, undefined, 2));
		$('#outputModal').html(json);
		
		//figure out a good way to display it
	})
	
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
		$('#ep' + id).show('slow');
	})
});

//from http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}