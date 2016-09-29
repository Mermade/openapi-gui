I/O Doctor
==========

I/O Doctor is a GUI for creating and editing JSON config files that are used with [I/O Docs](https://github.com/mashery/iodocs), an interactive API documentation system from [Mashery](http://www.mashery.com).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

I/O Doctor builds valid service description JSON for the stock I/O Docs however it also supports defining an HTTP request payload (referred to as 'Body Content' within IODocs) for POST, PUT, or DELETE requests as implemented by [I/O Docs/dgc-wh](https://github.com/dgc-wh/iodocs).

This implementations interface was heavily influenced by the original [IODoctor by Brandon West](https://github.com/brandonmwest/iodoctor).

Description
-----------
### How It Works

Select an existing I/O Docs config to upload, or create a new config and start adding Endpoints, Methods, and Parameters. When an existing config is used, it is parsed and forms for editing each Endpoint, Method, and Parameter will be created. 

Click an item from the menu on the left to begin editing. View the JSON output at any time by hitting the "output" tab. When finished, copy the output and save it to your iodocs api config. I/O Doctor does not store any data. Make sure you save your JSON output.

### Technology

I/O Doctor runs entirely client side using a couple of javascript frameworks including jQuery, Twitter Bootstrap, and (KnockoutJS)[http://knockoutjs.com/] as well as Ryan Niemeyer's [Knockout Sortable plugin](https://github.com/rniemeyer/knockout-sortable) for KnockoutJS. 

To get the app up and running just clone the repo and load index.html into a browser - couldn't be simpler.

TODO
----

* Add validation on form fields
