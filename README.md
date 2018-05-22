OpenAPI-GUI
===========

OpenAPI-GUI is a GUI for creating and editing OpenAPI version 3.0.x JSON/YAML definitions. In its current form it is most useful as a tool for starting off and editing simple OpenAPI definitions. Imported OpenAPI 2.0 definitions are automatically converted to v3.0.

![Screenshot](https://github.com/Mermade/openapi-gui/blob/master/img/screenshot.png?raw=true)

For the previous Swagger / OpenAPI 2.0-only version see [here](https://mikeralphson.github.io/openapi-gui). This version is currently **unmaintained** apart from security fixes.

This project was initially a fork of [Daryl Kuhn's IODoctor](https://github.com/darrylkuhn/iodoctor/tree/angular-port), which in turn was inspired by [IODoctor by Brandon West](https://github.com/brandonmwest/iodoctor) which was written in Ruby. The complete history of the project is maintained on GitHub.

Description
-----------
### How It Works

Select an existing OpenAPI 2.0 or 3.0.x definition to upload, or create a new definition and start adding Paths, Operations, and Parameters. When an existing definition is used, it is parsed and forms for editing each Path, Operation and Parameter will be created.

You can load an existing definition by appending a `?url=` query parameter to the initial start page.

Click an item from the menu on the left to begin editing. View the JSON/YAML output at any time by selecting one of the "Export" tabs. When finished, download the output to save it locally or copy it your clipboard. OpenAPI-GUI only stores one definition at a time, and this is in your browser's local-storage. Make sure you save your JSON/YAML output locally.

Before performing a destructive action, OpenAPI-GUI saves the current state of the definition. At all other times you must remember to select Save manually.

### Technology

OpenAPI-GUI runs entirely client-side using a number of Javascript frameworks including [Vue.JS](https://vuejs.org/), [jQuery](https://jquery.com/) and [Bulma](http://bulma.io/) for CSS.

To get the app up and running just browse to [the live version on GitHub pages](https://mermade.github.io/openapi-gui), deploy a clone to GitHub pages, deploy to Heroku using the button below, or clone the repo and point a browser at `index.html` or host it yourself - couldn't be simpler. More [technical information here](docs/technical.md).

You only need to `npm install` the Node.js modules if you wish to use the `openapi-gui` embedded web server (i.e. not if you are running your own web-server), otherwise they are only there for PaaS deployments.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### CLI options

```
-d, --definition    serve the given OAS definition
-l, --launch        start a web-browser pointing to the GUI
-p, --port          specify the port to run on, defaults to $PORT or 3000
-w, --write         enable writing back to the source definition
```

#### Running with Docker

If you don't have a local Node development environment, or if you would prefer to run OpenAPI-GUI in a Docker container, you can do in with a few simple steps:

1. Clone the repository.
2. Run `docker build -t mermade/openapi-gui .` to build the Docker image (`mermade/openapi-gui`)
3. Run `docker run --name openapi-gui -p 8080:3000 -d mermade/openapi-gui` to run the server on port 8080.
4. Navigate to `http://localhost:8080` in your favorite browser.
5. When you're done, shut down the server by running `docker stop openapi-gui && docker rm openapi-gui`

Or you can pull the pre-built Docker image:

* `docker pull mermade/openapi-gui`

### Limitations

* OpenAPI-GUI will de-reference shared parameters.
* The definition must be self-contained with no external `$ref`s. **This is likely to be resolved (ho-ho) soon**.
* Editing a response / example / body schema will dereference it.
* OpenAPI-GUI will not always preserve vendor-extensions, e.g. if a parameter is deleted and recreated.
* OpenAPI-GUI will not preserve comments from definitions imported in YAML format.

TODO
----

* See the [TODO list](/docs/TODO.md) and the current status of [OpenAPI 3.0 specification support](docs/openapi3-support.md).

