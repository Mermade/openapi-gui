OpenApi-gui
===========

OpenApi-gui is a GUI for creating and editing OpenApi version 3.0.x JSON/YAML definitions. In its current form it is most useful as a tool for starting off and editing simple OpenApi definitions. Imported OpenAPI 2.0 definitions are automatically converted to v3.0.

![Screenshot](https://github.com/Mermade/openapi-gui/blob/bulma/img/screenshot.png?raw=true)

This project was initially a fork of [Daryl Kuhn's IODoctor](https://github.com/darrylkuhn/iodoctor/tree/angular-port), which in turn was inspired by [IODoctor by Brandon West](https://github.com/brandonmwest/iodoctor) which was written in Ruby. The complete history of the project is maintained on GitHub.

Description
-----------
### How It Works

Select an existing OpenApi 2.0 or 3.0.x definition to upload, or create a new definition and start adding Paths, Operations, and Parameters. When an existing definition is used, it is parsed and forms for editing each Path, Operation and Parameter will be created.

You can load an existing definition by appending a `?url=` query parameter to the initial start page.

Click an item from the menu on the left to begin editing. View the JSON/YAML output at any time by selecting one of the "Export" tabs. When finished, download the output to save it locally or copy it your clipboard. OpenApi-gui only stores one definition at a time, and this is in your browser's local-storage. Make sure you save your JSON/YAML output locally.

Before performing a destructive action, OpenApi-Gui saves the current state of the definition. At all other times you must remember to select Save manually.

### Technology

OpenApi-gui runs entirely client-side using a number of Javascript frameworks including [Vue.JS](https://vuejs.org/), [jQuery](https://jquery.com/) and [Bulma](http://bulma.io/) for CSS.

To get the app up and running just browse to [the live Heroku version](https://openapi-gui.herokuapp.com), deploy to Heroku using the button below, or clone the repo and load `index.html` into a browser / host it yourself - couldn't be simpler.

You only need to `npm install` the Node.js modules if you wish to use the `Arapaho` embedded web server, otherwise they are only there for Heroku deploys.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Limitations

* OpenApi-gui will de-reference shared parameters.
* The definition must be self-contained with no external `$ref`s.
* Editing a response / example / body schema will dereference it.
* OpenApi-gui will not always preserve vendor-extensions, e.g. if a parameter is deleted and recreated.
* OpenApi-gui will not preserve comments from definitions imported in YAML format.

TODO
----

* See the [list](/docs/TODO.md)

