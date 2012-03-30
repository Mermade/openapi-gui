//SO MUCH SPAGHETTI!

$(function() {
	$('.viewOutput').click(function(e){
		var formdata = form2js('config', '.');
		var json = JSON.stringify(formdata, undefined, 2);
		var syntaxHighlightedJson = syntaxHighlight(json);
		
		$('#output').html('<pre>' + syntaxHighlightedJson + '</pre>');
		$('#json').val(json);
	});
	
	$('.endpointActuator').live('click', showEndpoint);
	
	$('#addEndpoint').click(addEndpoint);
	$('.removeEndpoint').live('click', removeEndpoint);
	$('.addMethod').live('click', addMethod);
	$('.removeMethod').live('click', removeMethod);
	
	$('.addParameter').live('click', addParameter);	
	$('.removeParameter').live('click', removeParameter);
	
	$('input.endpointName').live('change', updateEndpointName);
	$('input.methodName').live('change', updateMethodName);
	$('.section.clickable').live('click', toggleSection);


	$('input.dataType').live('change', updateParameterDataType);

	$($('.endpoint')[0]).show();
});

var updateParameterDataType = function(e) {
	var clicked = $(e.target);
	switch(clicked.val()) {
		case "custom":
			clicked.closest('.controls').find('.customInput').attr('disabled',false);
			clicked.closest('.controls').find('.customInput').show();
			clicked.closest('.controls').find('.enumeratedInput').hide();
			clicked.closest('.controls').find('.enumeratedInput').attr('disabled',true);
			if (clicked.closest('.controls').find('.customInput').val() == 'boolean' || clicked.closest('.controls').find('.customInput').val() == 'enumerated') {
				clicked.closest('.controls').find('.customInput').val('');
			}
			break;
		
		case "enumerated":
			clicked.closest('.controls').find('.customInput').hide();
			clicked.closest('.controls').find('.customInput').attr('disabled',true);
			clicked.closest('.controls').find('.customInput').val('enumerated');
			clicked.closest('.controls').find('.enumeratedInput').show();
			clicked.closest('.controls').find('.enumeratedInput').attr('disabled',false);
			break;
		
		case "boolean":
			clicked.closest('.controls').find('.customInput').attr('disabled',true);
			clicked.closest('.controls').find('.customInput').attr('disabled',true);
			clicked.closest('.controls').find('.enumeratedInput').hide();
			clicked.closest('.controls').find('.customInput').hide();
			clicked.closest('.controls').find('.customInput').val('boolean');
			break;			
	}
}

var toggleSection = function(e) {
	var clicked = $(e.target);
	var target = clicked.attr('target');
	$(target).slideToggle();
}

var showEndpoint = function(e) {
	e.preventDefault();
	var actuator = e.target;
	var id = actuator.id.replace("endpointActuator","");
	var div = $('#ep' + id);

	//if the clicked div is already showing, do nothing
	if(div.is(":visible"))
		return;

	//hide all divs
	$('.endpoint').hide();

	//show the div corresponding to what was clicked
	$('#ep' + id).show('slow');
};

var updateEndpointName = function(e) {
	var input = $(e.target);
	
	var endpointIndex = input.closest('.endpoint').attr('id').replace('ep','');
	var menuItem = $('#endpointActuator' + endpointIndex);

	menuItem.html(input.val());
}

var updateMethodName = function(e) {
	var span = $(e.target).closest('.method').find('.methodNameSpan');
	span.html($(e.target).val());
	
	var methodIndex = $(e.target).closest('.method').attr('methodIndex');
	var endpointIndex = $(e.target).closest('.method').attr('endpointIndex');
	var menuItem = $('#endpoint' + endpointIndex + 'method' + methodIndex +'Actuator');

	menuItem.html($(e.target).val());
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
	var endpointIndex = getEndpointIndex();
	
	var newEndpoint = $('#endpointTemplate').children('div').first().clone();
	newEndpoint = updateEndpoint(newEndpoint, newId);
	newEndpoint.addClass('endpoint');
	newEndpoint.removeClass('endpointTemplate');
	newEndpoint.appendTo('#config');
	
	//add the new Endpoint to the menu
	var newMenuItem = $("#endpointMenuTemplate").children('li').first().clone();
	newMenuItem = updateEndpointMenuItem(newMenuItem, newId);
	newMenuItem.appendTo('#endpointList');

	//all endpoints must have at least one method, so add a blank method here
	addFirstMethod(endpointIndex);
		
	//hide all divs
	$('.endpoint').hide();

	//show the div corresponding to what was clicked
	$('#ep' + endpointIndex).show('slow');
}

var removeEndpoint = function(e) {
	var endpoint = $(e.target).closest('.endpoint');
	var index = parseInt(endpoint.attr('id').replace('ep',''));
	var endpoints = $('.endpoint');
	
	if(confirm("Are you sure you want to delete this Endpoint?")) {
		//-1 to each endpoint index for indices > index being removed
		for(var i=index + 1; i <= endpoints.length-1; i++) {
			updateEndpoint($(endpoints[i-1]), i - 1, i);
			
			menuItem = $('#endpointActuator' + i).closest('li');
			updateEndpointMenuItem(menuItem, i - 1, i);
		}
		
		//remove the menuItem
		$('#endpointActuator' + index).closest('li').remove();
		
		//remove the endpoint from the DOMgit commit
		endpoint.remove();
		
		//update the counter
		count = parseInt($('#endpointCounter').val());
		$('#endpointCounter').val(count - 1);	
	}
}

var getEndpointIndex = function() { 
	newId = parseInt($('#endpointCounter').val()) + 1;
	$('#endpointCounter').val(newId);	
	return newId;
}

var initializeEndpoint = function(endpoint){
	newId = parseInt($('#endpointCounter').val()) + 1;
	$('#endpointCounter').val(newId);
}

//This is a bad function name. Rename.
var updateEndpoint = function(endpoint, newId, oldId) {
	
	if(typeof(oldId) != 'undefined')
		placeholder = oldId;
	else
		placeholder = 'blank';

	endpoint.attr('id', 'ep' + newId);
	
	//update the name and id of each child input
	endpoint.find('input').each(function(){
		if($(this).attr('id')) {
			$(this).attr('id', $(this).attr('id').replace(placeholder, newId));
		}
		
		if($(this).attr('name')) {
			$(this).attr('name', $(this).attr('name').replace(placeholder, newId));
		}
	});
	
	//update the for attribute of each child label
	endpoint.find('label').each(function(){
		if($(this).attr('for')) {
			$(this).attr('for', $(this).attr('for').replace(placeholder, newId));
		}
	});
	
	return endpoint;
}

var updateEndpointMenuItem = function(menuItem, newId, oldId) {
	if(typeof(oldId) != 'undefined')
		placeholder = oldId;
	else
		placeholder = 'blank';
	
	link = menuItem.children('a').first();
	link.attr('id', link.attr('id').replace(placeholder, newId));
	
	if(link.text().length == 0)
		link.text("New Endpoint");

	return menuItem;
}

var addFirstMethod = function(endpointIndex) {
	var newMethod = $('#methodTemplate').children('li').first().clone();
		
	methodIndex = getMethodIndex(endpointIndex);
	updateMethod(newMethod, endpointIndex, methodIndex);
	
	var methodList = $('#ep' + endpointIndex).children('ul').first();
	newMethod.appendTo(methodList);
}

var addMethod = function(e) {
	var endpoint = $(e.target).closest('.endpoint');
	var endpointIndex = endpoint.attr('id').replace('ep','');
	
	var newMethod = $('#methodTemplate').children('li').first().clone();
		
	methodIndex = getMethodIndex(endpointIndex);
	updateMethod(newMethod, endpointIndex, methodIndex);
	
	var methodList = $('#ep' + endpointIndex).children('ul').first();
	newMethod.appendTo(methodList);
	
	//add it to the menu
	var methodMenu = $('#methodMenuTemplate').children('li').first().clone();

	updateMethodMenuItem(methodMenu, endpointIndex, methodIndex);
	methodMenu.appendTo($('#endpointActuator' + endpointIndex).next('ul'));
}

var removeMethod = function(e) {
	var method = $(e.target).closest('.method');
	var methodIndex = parseInt(method.attr('methodindex'));
	var endpointIndex = method.attr('endpointindex');

	var siblingMethods = $('.method[endpointindex=' + endpointIndex + ']');
	
	if(confirm("Are you sure you want to delete this Method?")) {
		//-1 to each method index for indices > index being removed
		for(var i=methodIndex + 1; i <= siblingMethods.length ; i++) {
			updateMethod($(siblingMethods[i-1]), endpointIndex, i-1, i);
			
			menuItem = $('#endpoint' + endpointIndex + 'method' + i + 'Actuator').closest('li');
			updateMethodMenuItem(menuItem, endpointIndex, i - 1, i);
		}
		
		//remove the menuItem
		$('#endpoint' + endpointIndex + 'method' + methodIndex + 'Actuator').closest('li').remove();
		
		//remove the method from the DOM
		method.remove();
		
		//update the counter
		count = parseInt($('#endpoint' + endpointIndex + 'MethodCounter').val());
		$('#endpoint' + endpointIndex + 'MethodCounter').val(count - 1);	
	}
}

var getMethodIndex = function(endpointIndex) {
	//if this is the first method for the endpoint, we need to add a method counter
	if($('#endpoint' + endpointIndex + 'MethodCounter').length == 0) {
		counterTemplate = $('#methodCounterTemplate').children('input').first().clone();
		counterTemplate.attr('id', counterTemplate.attr('id').replace('!endpoint!', endpointIndex));
		counterTemplate.appendTo('#config');
	}
	
	counter = $("#endpoint" + endpointIndex + "MethodCounter");
	index = parseInt(counter.val()) + 1;
	counter.val(index);
	return index;
}

var updateMethod = function(method, endpointIndex, methodIndex, oldMethodIndex) {
	//update the name and id of each child input
	if(typeof(oldMethodIndex) != 'undefined')
		methodIndexPlaceholder = 'methods[' + oldMethodIndex + ']';
	else
		methodIndexPlaceholder = 'method[!method!]';
	
	methodIndexString = 'methods[' + methodIndex + ']';
	
	//this mess of replaces also updates any child parameters. good times!
	
	//doing these replaces is probably dumb, should just write the attrs each time.
	method.find('input').each(function(){
		if($(this).attr('id')) {
			$(this).attr('id', $(this).attr('id').replace('!endpoint!', endpointIndex));
			$(this).attr('id', $(this).attr('id').replace(methodIndexPlaceholder, methodIndexString));	
		}
		if($(this).attr('name')) {
			$(this).attr('name', $(this).attr('name').replace('!endpoint!', endpointIndex));
			$(this).attr('name', $(this).attr('name').replace(methodIndexPlaceholder, methodIndexString));
		}
	});
	
	method.find('textarea').each(function(){
		$(this).attr('id', $(this).attr('id').replace('!endpoint!', endpointIndex));
		$(this).attr('id', $(this).attr('id').replace(methodIndexPlaceholder, methodIndexString));	
		$(this).attr('name', $(this).attr('name').replace('!endpoint!', endpointIndex));
		$(this).attr('name', $(this).attr('name').replace(methodIndexPlaceholder, methodIndexString));
	});
	
	method.find('div').each(function(){
		if($(this).attr('id')) {
			$(this).attr('id', $(this).attr('id').replace('!endpoint!', endpointIndex));
			$(this).attr('id', $(this).attr('id').replace(methodIndexPlaceholder, methodIndexString));	
		}
	});
	
	//update the for attribute of each child label
	method.find('label').each(function(){
		if($(this).attr('for')) {
			$(this).attr('for', $(this).attr('for').replace('!endpoint!', endpointIndex));
			$(this).attr('for', $(this).attr('for').replace(methodIndexPlaceholder, methodIndexString));
		}
	});
	
	method.attr('endpointIndex', endpointIndex);
	method.attr('methodIndex', methodIndex);
	
	methodContainer = method.find('.methodContainer').first();
	methodContainer.attr('id', 'endpoint' + endpointIndex + 'method' + methodIndex);
	 
	section = method.find(".section").first();
	section.attr('target', section.attr('target').replace('!endpoint!', endpointIndex));
	section.attr('target', section.attr('target').replace('method' + oldMethodIndex, 'method' + methodIndex));
	section.attr('target', section.attr('target').replace('!method!', methodIndex));
	
	section.next('a').attr('name','endpoint' + endpointIndex + 'method' + methodIndex);
	
	//need to update parameter count element
	var paramCounter = $('#endpoint' + endpointIndex + 'method' + oldMethodIndex + 'ParameterCounter');
	if (paramCounter.length > 0)
		paramCounter.attr('id', '#endpoint' + endpointIndex + 'method' + methodIndex + 'ParameterCounter');
	
	return method;
}

var updateMethodMenuItem = function(menuItem, endpointIndex, newId, oldId) {
	if(typeof(oldId) != 'undefined')
		placeholder = oldId;
	else
		placeholder = '!method!';
	
	link = menuItem.children('a').first();
	link.attr('id', 'endpoint' + endpointIndex + 'method' + newId + 'Actuator');
	link.attr('href', 'endpoint' + endpointIndex + 'method' + newId );
	
	if(link.text().length == 0)
		link.text("New Method");

	return menuItem;
}

var getParameterIndex = function(endpointIndex, methodIndex) {
	//if this is the first parameter for the method, we need to add a parameter counter
	if($('#endpoint' + endpointIndex + 'Method' + methodIndex + 'ParameterCounter').length == 0) {
		counterTemplate = $('#parameterCounterTemplate').children('input').first().clone();
		counterTemplate.attr('id', counterTemplate.attr('id').replace('!endpoint!', endpointIndex));
		counterTemplate.attr('id', counterTemplate.attr('id').replace('!method!', methodIndex));
		counterTemplate.appendTo('#config');
	}
	
	counter = $('#endpoint' + endpointIndex + 'Method' + methodIndex + 'ParameterCounter');
	index = parseInt(counter.val()) + 1;
	counter.val(index);
	return index;
}

var addParameter = function(e) {
	var method = $(e.target).closest('.method');
	var endpointIndex = method.attr('endpointIndex');
	var methodIndex = method.attr('methodIndex');
	var newParameter = $('#parameterTemplate').children('li').first().clone();
		
	parameterIndex = getParameterIndex(endpointIndex, methodIndex);
	updateParameter(newParameter, endpointIndex, methodIndex, parameterIndex);

	var parameterList = $('.method[endpointIndex=' + endpointIndex + '][methodIndex=' + methodIndex + ']').find('.parameters').first();
	newParameter.appendTo(parameterList);
}

var removeParameter = function(e) {
	var parameter = $(e.target).closest('.parameter');
	var parameterIndex = parseInt(parameter.attr('parameterIndex'));
	var methodIndex = parameter.attr('methodIndex');
	var endpointIndex = parameter.attr('endpointIndex');

	var siblingParameters = $('.parameter[endpointIndex=' + endpointIndex + '][methodIndex=' + methodIndex + ']');
	
	if(confirm("Are you sure you want to delete this Parameter?")) {
		//-1 to each parameter index for indices > index being removed
		for(var i = parameterIndex+1; i <= siblingParameters.length ; i++) {
			updateParameter($(siblingParameters[i-1]), endpointIndex, methodIndex, i-1, i);
		}
		
		//remove the parameter from the DOM
		parameter.remove();
		
		//update the counter
		count = parseInt($( '#endpoint' + endpointIndex + 'method' + methodIndex + 'ParameterCounter').val());
		$( '#endpoint' + endpointIndex + 'method' + methodIndex + 'ParameterCounter').val(count - 1);	
	}
}

var updateParameter = function(parameter, endpointIndex, methodIndex, parameterIndex, oldParameterIndex) {
	//update the name and id of each child input
	if(typeof(oldParameterIndex) != 'undefined')
		parameterIndexPlaceholder = 'parameters[' + oldParameterIndex + ']';
	else
		parameterIndexPlaceholder = 'parameters[!parameter!]';
	
	parameterIndexString = 'parameters[' + parameterIndex + ']';
	
	//this mess of replaces also updates any child parameters. good times!
	
	//doing these replaces is probably dumb, should just write the attrs each time.
	parameter.find('input').each(function(){
		if($(this).attr('id')) {
			$(this).attr('id', $(this).attr('id').replace(parameterIndexPlaceholder, parameterIndexString));	
			$(this).attr('id', $(this).attr('id').replace('!method!', methodIndex));
			$(this).attr('id', $(this).attr('id').replace('!endpoint!', endpointIndex));
		}
		if($(this).attr('name')) {
			var name = $(this).attr('name').replace(parameterIndexPlaceholder, parameterIndexString);
			$(this).attr('name', name);
			$(this).attr('name', $(this).attr('name').replace('!method!', methodIndex));
			$(this).attr('name', $(this).attr('name').replace('!endpoint!', endpointIndex));
		}
	});
	
	parameter.find('textarea').each(function(){
		$(this).attr('id', $(this).attr('id').replace(parameterIndexPlaceholder, parameterIndexString));	
		$(this).attr('id', $(this).attr('id').replace('!method!', methodIndex));
		$(this).attr('id', $(this).attr('id').replace('!endpoint!', endpointIndex));
		
		$(this).attr('name', $(this).attr('name').replace(parameterIndexPlaceholder, parameterIndexString));
		$(this).attr('name', $(this).attr('name').replace('!method!', methodIndex));
		$(this).attr('name', $(this).attr('name').replace('!endpoint!', endpointIndex));
	});
	
	parameter.find('div').each(function(){
		if($(this).attr('id')) {
			$(this).attr('id', $(this).attr('id').replace(parameterIndexPlaceholder, parameterIndexString));	
			$(this).attr('id', $(this).attr('id').replace('!method!', methodIndex));
			$(this).attr('id', $(this).attr('id').replace('!endpoint!', endpointIndex));			
		}
	});
	
	//update the for attribute of each child label
	parameter.find('label').each(function(){
		if($(this).attr('for')) {
			$(this).attr('for', $(this).attr('for').replace(parameterIndexPlaceholder, parameterIndexString));
			$(this).attr('for', $(this).attr('for').replace('!method!', methodIndex));
			$(this).attr('for', $(this).attr('for').replace('!endpoint!', endpointIndex));
		}
	});
	
	parameter.attr('endpointIndex', endpointIndex);
	parameter.attr('methodIndex', methodIndex);
	parameter.attr('parameterIndex', parameterIndex);	
	
	parameterContainer = parameter.find('.parameterContainer').first();
	parameterContainer.attr('id', 'endpoint' + endpointIndex + 'method' + methodIndex + 'parameter' + parameterIndex);
	 
	section = parameter.find(".section").first();
	section.attr('target', section.attr('target').replace('parameter' + oldParameterIndex, 'parameter' + parameterIndex));
	section.attr('target', section.attr('target').replace('!endpoint!', endpointIndex));
	section.attr('target', section.attr('target').replace('!method!', methodIndex));
	section.attr('target', section.attr('target').replace('!parameter!', parameterIndex));
	
	section.next('a').attr('name','endpoint' + endpointIndex + 'method' + parameterIndex);
	
	return parameter;
}