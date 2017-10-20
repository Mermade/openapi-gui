# OpenAPI v3 support

Tracking: [v3.0.0][oa3]

This document originated at https://github.com/temando/open-api-renderer/blob/master/docs/open-api-v3-support.md

This document outlines this project's support for visualising the [OpenAPI V3][oa3] specification. Content is outlined in the same order as the original specification to make reading as quick (and familiar) as possible.

## General

### [Data Types](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#dataTypes)

- [x] Primitive data types, `integer`, `number`, `string` and `boolean`.
- [ ] Any `format` will be displayed.

### [Rich Text Formatting](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#rich-text-formatting)

- [ ] All `description` fields support [CommonMark][cm].

### [Relative References in URLs](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#relative-references-in-urls)

- [ ] Relative references are resolved using the URLs defined in the Server Object as a Base URI.
- [x] Relative references used in `$ref` are processed as per JSON Reference.

## Schema

### [OpenAPI](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#openapi-object) object

- [ ] openapi
- [x] [info](#info-object)
- [x] [servers](#servers-object)
- [ ] [paths](#paths-object)
- [ ] [components](#components-object)
- [x] [security](#security-requirement-object)
- [ ] [tags](#tag-object)
- [x] [externalDocs](#external-documentation-object)

### [Info](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#info-object) object

- [x] title
- [x] description
- [x] termsOfService
- [x] [contact](#contact-object)
- [x] [license](#license-object)
- [x] version

### [Contact](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#contact-object)

- [x] name
- [x] url
- [x] email

### [License](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#license-object) object

- [x] name
- [x] url

### [Server](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#server-object) object

- [x] url
- [x] description
- [x] [variables](#server-variable-object)

### [Server Variable](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#server-variable-object) object

- [x] enum
- [x] default
- [x] description

### [Components](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#components-object) object

This is supported by default as all `$ref` are dereferenced before the definition is visualised. As per spec, Components have _no impact_ on visualising the API reference, they are simply a placeholder for reusable objects.

- [x] [schemas](#schema-object)
- [x] [responses](#responses-object)
- [x] [parameters](#parameter-object)
- [ ] [examples](#example-object)
- [x] [requestBodies](#request-body-object)
- [x] [headers](#header-object)
- [x] [securitySchemes](#security-scheme-object)
- [ ] [links](#link-object)
- [x] [callbacks](#callback-object)

### [Paths](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#paths-object) object

- [ ] [pathItem](#path-item-object)

### [Path Item](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#path-item-object) object

- [ ] $ref
- [x] summary
- [x] description
- [x] [get](#operation-object)
- [x] [put](#operation-object)
- [x] [post](#operation-object)
- [x] [delete](#operation-object)
- [x] [options](#operation-object)
- [x] [head](#operation-object)
- [x] [patch](#operation-object)
- [x] [trace](#operation-object)
- [ ] [servers](#server-object)
- [x] [parameters](#parameter-object)

### [Operation](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#operation-object) object

- [ ] tags
- [x] summary
- [x] description
- [x] [externalDocs](#external-documentation-object)
- [x] operationId
- [x] [parameters](#parameter-object)
- [x] [requestBody](#request-body-object)
- [x] [responses](#responses-object)
- [x] [callbacks](#callback-object)
- [x] deprecated
- [ ] [security](#security-scheme-object)
- [ ] [servers](#server-object)

### [External Documentation](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#external-documentation-object) object

- [x] description
- [x] url

### [Parameter](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#parameter-object) object

- [x] name
- [x] in
    - [x] query
    - [x] header
    - [x] path
    - [x] cookie
- [x] description
- [x] required
- [x] deprecated
- [x] allowEmptyValue

#### schema extensions

- [ ] style
    - [ ] matrix
    - [ ] label
    - [ ] form
    - [ ] simple
    - [ ] spaceDelimited
    - [ ] pipeDelimited
    - [ ] deepObject
- [ ] explode
- [ ] allowReserved
- [ ] [schema](#schema-object)
- [ ] example
- [ ] examples
- [ ] content

### [Request Body](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#request-body-object) object

- [x] description
- [x] [content](#media-type-object)
- [x] required

### [Media Type](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#media-type-object) object

- [x] [schema](#schema-object)
- [ ] [example](#example-object)
- [ ] [examples](#example-object)
- [ ] [encoding](#encoding-object)

### [Encoding](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#encoding-object) object

- [ ] contentType
- [ ] [headers](#header-object)
- [ ] style
- [ ] explode
- [ ] allowReserved

### [Responses](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#responses-object) object

- [x] [response](#response-object)

### [Response](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#response-object) object

- [x] description
- [x] [headers](#header-object)
- [x] [content](#media-type-object)
- [ ] [links](#link-object)

### [Callback](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#callback-object) object

- [x] [expression](#path-item-object)

### [Example](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#example-object) object

- [ ] summary
- [ ] description
- [ ] value
- [ ] externalValue

### [Link](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#link-object) object

- [ ] operationRef
- [ ] operationId
- [ ] parameters
- [ ] requestBody
- [ ] description
- [ ] [server](#server-object)

### [Header](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#header-object) object

See [parameter](#parameter-object) object.

### [Tag](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#tag-object) object

- [x] name
- [x] description
- [x] [externalDocs](#external-documentation-object)

### [Reference](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#reference-object) object

- [ ] $ref

### [Schema](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#schema-object) object

The `Schema` object describes several properties that are shared from JSON Schema, deviations from JSON Schema, or in addition to JSON Schema. The following descibes this project's support for these properties.

#### Properties

The following properties are supported, and implemented according to the [JSON Schema Validation spec][jsschema]:

- [ ] multipleOf
- [ ] maximum
- [ ] exclusiveMaximum
- [ ] minimum
- [ ] exclusiveMinimum
- [ ] maxLength
- [ ] minLength
- [ ] pattern
- [ ] maxItems
- [ ] minItems
- [ ] uniqueItems
- [ ] maxProperties
- [ ] minProperties
- [ ] format
- [ ] required
- [ ] enum

#### Adjusted JSON Schema Properties

The OpenAPI specification also supports several additional properties from JSON Schema, with some adjustments. This project attempts to honor these adjustments, with any exceptions outlined below:

- [ ] type - Value may be an array, multiple types are supported.
- [ ] allOf
- [ ] oneOf
- [ ] anyOf
- [ ] not
- [ ] items
- [ ] properties
- [ ] additionalProperties
- [ ] description
- [ ] format
- [ ] default

#### Fixed Fields

- [ ] nullable
- [ ] [discriminator](#discriminator-object)
- [ ] readOnly
- [ ] writeOnly
- [ ] [xml](#xml-object)
- [ ] [externalDocs](#external-documentation-object)
- [ ] example
- [ ] deprecated

### [Discriminator](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#discriminator-object) object

- [ ] propertyName
- [ ] mapping

### [XML](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#xml-object) object

- [ ] name
- [ ] namespace
- [ ] prefix
- [ ] attribute
- [ ] wrapped

### [Security Scheme](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#security-scheme-object) object

- [x] type
  - [x] apiKey
  - [x] http
  - [x] oauth2
  - [x] openIdConnect
- [x] description
- [x] name
- [x] in
- [x] scheme
- [x] bearerFormat
- [x] [flows](#oauth-flows-object)
- [x] openIdConnectUrl

### [OAuth Flows](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#oauth-flows-object) object

- [x] [implict](#oauth-flow-object)
- [x] [password](#oauth-flow-object)
- [x] [clientCredentials](#oauth-flow-object)
- [x] [authorizationCode](#oauth-flow-object)

### [OAuth Flow](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#oauth-flow-object) object

- [x] authorizationUrl
- [x] tokenUrl
- [x] refreshUrl
- [x] scopes

### [Security Requirement](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#security-requirement-object) object

- [x] oauth2
- [x] openIdConnect
- [x] "other"

### [Specification Extensions](https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.md#specification-extensions)

No extension properties are supported at this time.

[cm]: http://spec.commonmark.org/0.27/
[jsschema]: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6
[oa3]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md

