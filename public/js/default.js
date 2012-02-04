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
	
	$('input.endpointName').live('change', updateEndpointName)
});

var updateEndpointName = function(e) {
	var span = $(e.target).closest('.endpoint').find('.endpointNameSpan');
	span.html($(e.target).val());
	
	var endpointIndex = $(e.target).closest('.endpoint').attr('id').replace('ep','');
	var menuItem = $('#endpointActuator' + endpointIndex);

	var menuIcon = '<ins class="jstree-icon">&nbsp;</ins>';
	menuItem.html(menuIcon + $(e.target).val());
}

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

//TODO refactor these methods into 3 objects - endpoint, method, parameter
var addEndpoint = function(){
	var newEndpoint = $('#endpointTemplate').children('div').first().clone();
	newEndpoint = initializeEndpoint(newEndpoint);
	
	newEndpoint.appendTo('#config');
	
	//all endpoints must have at least one method, so add a blank method here
	
	//add the new Endpoint to the menu (and possibly refresh the tree?)
	
	
	console.log(newEndpoint);
}

var initializeEndpoint = function(endpoint){
	newId = parseInt($('#endpointCounter').val()) + 1;
	$('#endpointCounter').val(newId);
	return updateEndpoint(endpoint, newId);
}

var updateEndpoint = function(endpoint, newId) {
	endpoint.attr('id', 'ep' + newId);
	
	//update the name and id of each child input
	endpoint.find('input').each(function(){
		$(this).attr('id', $(this).attr('id').replace('blank', newId));
		$(this).attr('name', $(this).attr('name').replace('blank', newId));
	});
	
	//update the for attribute of each child label
	endpoint.find('label').each(function(){
		$(this).attr('for', $(this).attr('for').replace('blank', newId));
	});
	
	return endpoint;
}

//Deleting an endpoint :-
//nuke all child parameters and methods
//update the endpointXMethodCounter after removing all the methods
//select all the endpoints that had an index higher than the one removed, and decrease each index by 1



