* ~~Finish server parameters~~
* ~~Finish parameter enums~~
* Rework tags-input
* ~~Editing of requestBody schemas / content-types~~
* Editing of requestBody examples
* Add validation on form fields
  * License name is required if license url is filled in (thus the object is present)
  * Server.url is required
  * Server.variable.default is required
  * ExternalDocs.url is required if description is set (thus the object is present)
  * Parameter.name is required
  * ~~Parameter.in is required~~
  * ~~Required for path parameters is required (true)~~
  * Content of requestBody is required
  * Response description is required
  * Tag name is required
  * ~~SecurityScheme type is required~~
    * name ~~and in~~ for apiKey
    * scheme for http
    * flows for oauth2
      * various urls etc for oauth2
    * openIdConnectUrl for openIdConnect
* markdown previews
  * ~~operation.description markdown preview~~
  * response.description markdown preview
  * tag.description markdown preview
  * externalDocs.description markdown preview
  * requestBody.description markdown preview
* Callbacks
* Links
* Handle circular `$ref`s in responses / examples / body schemas
