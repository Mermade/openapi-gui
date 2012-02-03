$(function() {
	$('.tabs').tabs();	
	
	$('.tabs').bind('change', function (e) {
	  var prevTab = $('#' + $(e.relatedTarget).attr('tab'));
	  prevTab.hide(); // previous tab
	  
	  var newTab =  $('#' + $(e.target).attr('tab'));
	  newTab.show(); // activated tab
	})
	
	$("#tree")
		.jstree({ "plugins" : ["themes","html_data","ui"] })
		.delegate("a.endpointActuator", "click", function(e) {
			e.preventDefault();
			var actuator = e.target;
			var id = actuator.id.replace("endpointActuator","");
			var div = $('#ep' + id);

			$('#start').hide();

			//if the clicked div is already showing, do nothing
			if(div.is(":visible"))
				return;

			//hide all divs
			$('.endpoint').hide();

			//show the div corresponding to what was clicked
			$('#ep' + id).show('slow');
		})
	
	$('.viewOutput').click(function(e){
		var formdata = form2js('config', '.');
		var json = JSON.stringify(formdata, undefined, 2);
		var syntaxHighlightedJson = syntaxHighlight(json);
		
		$('#output').html('<pre>' + syntaxHighlightedJson + '</pre>');
		$('#json').val(json);
	})
	
	$('#addEndpoint').click(addEndpoint);
});

//from http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
var syntaxHighlight = function(json) {
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


//TODO make a Endpoint object to contain these methods
var addEndpoint = function(){
	var newEndpoint = $('#endpointTemplate').children('div').first().clone();
	newEndpoint = initializeEndpoint(newEndpoint);
	
	newEndpoint.appendTo('#config');
	console.log(newEndpoint);
}

var initializeEndpoint = function(endpoint){
	newId = parseInt($('#endpointCounter').val()) + 1;
	$('#endpointCounter').val(newId);
	return updateEndpoint(endpoint, newId);
	
	//get the count of endpoints
	//increment it, use new value to for id replacement
	//update the id of all the child elements in the template to use the new id
	//update the for attr of 	%label.nameLabel{:for => "endpoints[blank].name"}
	//update id of all inputs
}

var updateEndpoint = function(endpoint, newId) {
	endpoint.attr('id', 'ep' + newId);
	
	endpoint.find('input').each(function(){
		$(this).attr('id', $(this).attr('id').replace('blank', newId));
		$(this).attr('name', $(this).attr('name').replace('blank', newId));
	});
	
	endpoint.find('label').each(function(){
		$(this).attr('for', $(this).attr('for').replace('blank', newId));
	});
	
	return endpoint;
}