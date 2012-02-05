I/O Doctor
==========

I/O Doctor is a GUI for creating and editing JSON config files that are used with [I/O Docs](https://github.com/mashery/iodocs), an interactive API documentation system from [Mashery](http://www.mashery.com).

This project is still under active development. You should be able to edit existing Endpoints just fine, but adding/removing them from the GUI is still in the works. I/O Doctor is not currently a hosted application.

Description
-----------
### How It Works

Select an existing I/O Docs config to upload, or create a new config and start adding Endpoints, Methods, and Parameters. When an existing config is used, it is parsed and forms for editing each Endpoint, Method, and Parameter will be created. 

Click an item from the menu on the left to begin editing. View the JSON output at any time by hitting the "output" tab. When finished, click "Save File" to download the JSON file. I/O Doctor does not store any data. Make sure you save your JSON output.

### Technology

I/O Doctor is built on [Sinatra](http://www.sinatrarb.com), Twitter Bootstrap 1.0, and jQuery, and uses [form2js](https://github.com/maxatwork/form2js) for structured, hierarchical HTML form data. 

TODO
----
* Finish JavaScript for adding and removing Endpoints, Methods, Parameters
* When a method in the menu is clicked, make sure the parent endpoint is visible
* Update form formatting to reflect the hierarchy (endpoint -> methods -> parameters)
* Add code to show/hide methods for an endpoint, and parameters for a method
* Add validation on form fields
* Ability to reorder nodes
* Refactor JavaScript