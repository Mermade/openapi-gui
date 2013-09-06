// Contains the "plumbing" required to run the application (e.g. bind UI to 
// objects, bind events, etc...)

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

        // Unfortunately there's a known issue with dynamically writing to  
        // pretty print managed <pre> blocks. To solve for this I create a new  
        // randomly ID'd pre block and write to it.
        codeContainerId = 'output-'+ Math.floor(Math.random()*10000000);
        $('#json-output').html('<pre class="prettyprint" id="'+codeContainerId+'"></pre>');
        json = JSON.stringify(displayViewModel, undefined, 4);
        $('#'+codeContainerId).html( json );

        prettyPrint();
    });

    $( "#addEndpoint" ).click(function() {
        viewModel.addEndpoint();
    });

    var clip = new ZeroClipboard( document.getElementById("copy-output"), {
        moviePath: "/js/ZeroClipboard.swf"
    });
});