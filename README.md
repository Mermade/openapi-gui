OpenApi-gui
===========

## Work in Progress

**Warning!** Outputting to OpenApi format is still in flux, and may not preserve all data of a loaded definition.

OpenApi-gui is a GUI for creating and editing OpenApi (Swagger) JSON/YAML definitions. In its current form it is most useful as a tool for starting off and editing simple OpenApi definitions.

This project was initially a fork of [Daryl Kuhn's IODoctor](https://github.com/darrylkuhn/iodoctor/tree/angular-port), which in turn was inspired by [IODoctor by Brandon West](https://github.com/brandonmwest/iodoctor) which was written in Ruby.

Description
-----------
### How It Works

Select an existing OpenApi definition to upload, or create a new definition and start adding Paths, Operations, and Parameters. When an existing definition is used, it is parsed and forms for editing each Path, Operation and Parameter will be created.

Click an item from the menu on the left to begin editing. View the JSON/YAML output at any time by selecting one of the "Export" tabs. When finished, download the output to save it locally or copy it your clipboard. OpenApi-gui only stores one definition at a time, and this is in your browser's local-storage. Make sure you save your JSON/YAML output locally.

Before performing a destructive action, OpenApi-Gui saves the current state of the definition. At all other times you must remember to select Save manually.

### Technology

OpenApi-gui runs entirely client-side using a number of Javascript frameworks including [jQuery](https://jquery.com/), Twitter [Bootstrap](https://getbootstrap.com/), and [Vue.JS](https://vuejs.org/).

To get the app up and running just browse to [the GitHub.io page](https://github.io/mermade/openapi-gui), deploy to Heroku using the button below, or clone the repo and load index.html into a browser / host it yourself - couldn't be simpler.

You only need to `npm install` the Node.js modules if you wish to use the `Arapaho` embedded web server, otherwise they are only there for Heroku deploys.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Limitations

* OpenApi-gui will de-reference shared parameters. For publication, you may wish to pass your OpenApi definition through a tool such as [OpenApi-optimise](https://githhub.com/mermade/openapi_optimise).
* OpenApi-gui will not always preserve vendor-extensions.
* OpenApi-gui will not preserve comments from definitions imported in YAML format.

TODO
----

* Add validation on form fields
* De-reference path-item `$ref`s (rare)
* Handle responses / examples

