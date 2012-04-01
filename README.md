I/O Doctor
==========

I/O Doctor is a GUI for creating and editing JSON config files that are used with [I/O Docs](https://github.com/mashery/iodocs), an interactive API documentation system from [Mashery](http://www.mashery.com).

This project is still under active development. I/O Doctor is not currently a hosted application.

Description
-----------
### How It Works

Select an existing I/O Docs config to upload, or create a new config and start adding Endpoints, Methods, and Parameters. When an existing config is used, it is parsed and forms for editing each Endpoint, Method, and Parameter will be created. 

Click an item from the menu on the left to begin editing. View the JSON output at any time by hitting the "output" tab. When finished, click "Save File" to download the JSON file. I/O Doctor does not store any data. Make sure you save your JSON output.

### Technology

I/O Doctor is built on [Sinatra](http://www.sinatrarb.com), Twitter Bootstrap 2.0, and jQuery, and uses [form2js](https://github.com/maxatwork/form2js) for structured, hierarchical HTML form data. 

TODO
----
* Titles are not currently clicking
* Highlight selected Endpoint in the menu
* Wire up the Method links in the menu
* Add validation on form fields
* Refactor JavaScript
* Ability to reorder nodes

* <del>Finish JavaScript for adding Endpoints, Methods, Parameters</del>
* <del>Finish JavaScript for removing Endpoint, Methods, Parameters</del>
* <del>Update form formatting to reflect the hierarchy (endpoint -> methods -> parameters)</del>
* <del>Add code to show/hide methods for an endpoint, and parameters for a method</del>
* <del>JavaScript for editing option lists for Parameters marked as enumerated</del>