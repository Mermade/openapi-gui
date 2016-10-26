OpenApi-gui
===========

OpenApi-gui is a GUI for creating and editing OpenApi (Swagger) JSON/YAML definitions. 

This project was initially a fork of [Daryl Kuhn's IODoctor](https://github.com/darrylkuhn/iodoctor/tree/angular-port), which in turn was inspired by [IODoctor by Brandon West](https://github.com/brandonmwest/iodoctor) which is written in Ruby.

Description
-----------
### How It Works

Select an existing OpenApi definition to upload, or create a new definition and start adding Paths, Operations, and Parameters. When an existing definition is used, it is parsed and forms for editing each Path, Operation and Parameter will be created.

Click an item from the menu on the left to begin editing. View the JSON/YAML output at any time by selecting the "Export" tabs. When finished, copy the output and save it locally. OpenApi-gui does not currently store any data. Make sure you save your JSON/YAML output.

### Technology

OpenApi-gui runs entirely client side using a number of Javascript frameworks including jQuery, Twitter Bootstrap, and AngularJS.

To get the app up and running just browse to [the GitHub.io page](https://github.io/mermade/openapi-gui), deploy to Heroku using the button below, or clone the repo and load index.html into a browser - couldn't be simpler.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

TODO
----

* Add validation on form fields

