# Technical notes

## Local deployment

OpenAPI-GUI can be run as a static web application by any web server, including [GitHub pages](https://pages.github.com/). You can simply point a browser at the `index.html` page from your file-system and everything should work.

Alternatively, running the included `openapi-gui` micro-server will start the application,
on the port specified by the `PORT` environment variable, defaulting to 3000. This will also
give you a built-in API based on [openapi-webconverter](https://github.com/Mermade/openapi-webconverter) for fast local conversions and validations.

## Storage engines

At present, OpenAPI-GUI implements a single storage engine using the browser's
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage).

Protected by a [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), the current OpenAPI definition is stored as a JSON string in the following keys:

|OpenAPI version|Storage Key|
|---|---|
|OpenAPI 3.0.x|openapi3|
|OpenAPI/Swagger 2.0|swagger2|
