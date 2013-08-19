$(document).ready(function() {
    // Activates knockout.js
    viewModel = new AppViewModel();
    ko.applyBindings(viewModel);

    $( "#load-definition" ).click(function() {
        srcDef = JSON.parse($('#service-definition').val());
        ko.mapping.fromJS(srcDef, knockoutMapping, viewModel);
        $('#editor-tab').tab('show');
    });

    $( "#output-tab" ).click(function() {
        // Work on a copy of the view model because we're going to clean up 
        // some management/metadata stuff
        //displayViewModel = jQuery.extend({}, viewModel);
        displayViewModel = jQuery.parseJSON(ko.toJSON(viewModel));
        cleanUp(displayViewModel);

        json = JSON.stringify(displayViewModel, undefined, 4);
        $('#json-output').html( json );

        prettyPrint();
    });

    $( "#addEndpoint" ).click(function() {
        viewModel.addEndpoint();
    });

    var clip = new ZeroClipboard( document.getElementById("copy-output"), {
        moviePath: "/js/ZeroClipboard.swf"
    });
    
});