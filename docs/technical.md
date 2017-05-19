# Technical notes

## Local deployment

OpenAPI-GUI can be run as a static web application by any web server, including [GitHub pages](https://pages.github.com/).

Alternatively, running the included [Arapaho](https://github.com/Mermade/arapaho) micro-server
will start the application, on the port specified by the `PORT` environment variable, defaulting to 3000.

## Storage engines

At present, OpenAPI-GUI implements a single storage engine using the browser's 
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage).

Protected by a [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), the current OpenAPI definition is stored as a JSON string in the following keys:

|OpenAPI version|Storage Key|
|---|---|
|OpenAPI/Swagger 2.0|swagger2|
|OpenAPI 3.0.x|openapi3|
