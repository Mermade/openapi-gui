I/O Doctor
==========

You can now use I/O Doctor as a hosted application via [iodoctor.net](http://www.iodoctor.net).

I/O Doctor is a GUI for creating and editing JSON config files that are used with [I/O Docs](https://github.com/mashery/iodocs), an interactive API documentation system from [Mashery](http://www.mashery.com).

I/O Doctor builds valid service description JSON for the stock I/O Doctor however it also supports defining an HTTP request payload (referred to as 'Body Content' within IODocs) for POST, PUT, or DELETE requests as implemented by [I/O Docs/dgc-wh](https://github.com/dgc-wh/iodocs).

This implementations interface was heavily influenced by the original [IODoctor by Brandon West](https://github.com/brandonmwest/iodoctor).

Description
-----------
### How It Works

Select an existing I/O Docs config to upload, or create a new config and start adding Endpoints, Methods, and Parameters. When an existing config is used, it is parsed and forms for editing each Endpoint, Method, and Parameter will be created. 

Click an item from the menu on the left to begin editing. View the JSON output at any time by hitting the "output" tab. When finished, click "Save File" to download the JSON file. I/O Doctor does not store any data. Make sure you save your JSON output.

### Technology

I/O Doctor is built on [Sinatra](http://www.sinatrarb.com), Twitter Bootstrap 2.0, and jQuery, and uses [form2js](https://github.com/maxatwork/form2js) for structured, hierarchical HTML form data. 

TODO
----

* Refactor to use a Javascript MVC framework
* Highlight selected Endpoint in the menu
* Wire up the Method links in the menu
* Add validation on form fields
* Ability to reorder nodes
* Ability to edit JSON directly on output tab - GUI v Source view
* Ability to copy a node
* Add Parameter buttons both above and below the list of parameters
* Default the paramater data type to be custom: string