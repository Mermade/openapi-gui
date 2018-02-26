var petstore = {"openapi": "3.0.0","servers": [{"url": "http://petstore.swagger.io/v2"}],"info": {"description": ":dog: :cat: :rabbit: This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.","version": "1.0.0","title": "Swagger Petstore","termsOfService": "http://swagger.io/terms/","contact": {"email": "apiteam@swagger.io"},"license": {"name": "Apache 2.0","url": "http://www.apache.org/licenses/LICENSE-2.0.html"}},"tags": [{"name": "pet","description": "Everything about your Pets","externalDocs": {"description": "Find out more","url": "http://swagger.io"}},{"name": "store","description": "Access to Petstore orders"},{"name": "user","description": "Operations about user","externalDocs": {"description": "Find out more about our store","url": "http://swagger.io"}}],"paths": {"/pet": {"post": {"tags": ["pet"],"summary": "Add a new pet to the store","description": "","operationId": "addPet","responses": {"405": {"description": "Invalid input"}},"security": [{"petstore_auth": ["write:pets","read:pets"]}],"requestBody": {"$ref": "#/components/requestBodies/Pet"}},"put": {"tags": ["pet"],"summary": "Update an existing pet","description": "","operationId": "updatePet","responses": {"400": {"description": "Invalid ID supplied"},"404": {"description": "Pet not found"},"405": {"description": "Validation exception"}},"security": [{"petstore_auth": ["write:pets","read:pets"]}],"requestBody": {"$ref": "#/components/requestBodies/Pet"}}},"/pet/findByStatus": {"get": {"tags": ["pet"],"summary": "Finds Pets by status","description": "Multiple status values can be provided with comma separated strings","operationId": "findPetsByStatus","parameters": [{"name": "status","in": "query","description": "Status values that need to be considered for filter","required": true,"explode": true,"schema": {"type": "array","items": {"type": "string","enum": ["available","pending","sold"],"default": "available"}}}],"responses": {"200": {"description": "successful operation","content": {"application/xml": {"schema": {"type": "array","items": {"$ref": "#/components/schemas/Pet"}}},"application/json": {"schema": {"type": "array","items": {"$ref": "#/components/schemas/Pet"}}}}},"400": {"description": "Invalid status value"}},"security": [{"petstore_auth": ["write:pets","read:pets"]}]}},"/pet/findByTags": {"get": {"tags": ["pet"],"summary": "Finds Pets by tags","description": "Muliple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.","operationId": "findPetsByTags","parameters": [{"name": "tags","in": "query","description": "Tags to filter by","required": true,"explode": true,"schema": {"type": "array","items": {"type": "string"}}}],"responses": {"200": {"description": "successful operation","content": {"application/xml": {"schema": {"type": "array","items": {"$ref": "#/components/schemas/Pet"}}},"application/json": {"schema": {"type": "array","items": {"$ref": "#/components/schemas/Pet"}}}}},"400": {"description": "Invalid tag value"}},"security": [{"petstore_auth": ["write:pets","read:pets"]}],"deprecated": true}},"/pet/{petId}": {"get": {"tags": ["pet"],"summary": "Find pet by ID","description": "Returns a single pet","operationId": "getPetById","parameters": [{"name": "petId","in": "path","description": "ID of pet to return","required": true,"schema": {"type": "integer","format": "int64"}}],"responses": {"200": {"description": "successful operation","content": {"application/xml": {"schema": {"$ref": "#/components/schemas/Pet"}},"application/json": {"schema": {"$ref": "#/components/schemas/Pet"}}}},"400": {"description": "Invalid ID supplied"},"404": {"description": "Pet not found"}},"security": [{"api_key": []}]},"post": {"tags": ["pet"],"summary": "Updates a pet in the store with form data","description": "","operationId": "updatePetWithForm","parameters": [{"name": "petId","in": "path","description": "ID of pet that needs to be updated","required": true,"schema": {"type": "integer","format": "int64"}}],"responses": {"405": {"description": "Invalid input"}},"security": [{"petstore_auth": ["write:pets","read:pets"]}],"requestBody": {"content": {"application/x-www-form-urlencoded": {"schema": {"type": "object","properties": {"name": {"description": "Updated name of the pet","type": "string"},"status": {"description": "Updated status of the pet","type": "string"}}}}}}},"delete": {"tags": ["pet"],"summary": "Deletes a pet","description": "","operationId": "deletePet","parameters": [{"name": "api_key","in": "header","required": false,"schema": {"type": "string"}},{"name": "petId","in": "path","description": "Pet id to delete","required": true,"schema": {"type": "integer","format": "int64"}}],"responses": {"400": {"description": "Invalid ID supplied"},"404": {"description": "Pet not found"}},"security": [{"petstore_auth": ["write:pets","read:pets"]}]}},"/pet/{petId}/uploadImage": {"post": {"tags": ["pet"],"summary": "uploads an image","description": "","operationId": "uploadFile","parameters": [{"name": "petId","in": "path","description": "ID of pet to update","required": true,"schema": {"type": "integer","format": "int64"}}],"responses": {"200": {"description": "successful operation","content": {"application/json": {"schema": {"$ref": "#/components/schemas/ApiResponse"}}}}},"security": [{"petstore_auth": ["write:pets","read:pets"]}],"requestBody": {"content": {"application/octet-stream": {"schema": {"type": "string","format": "binary"}}}}}},"/store/inventory": {"get": {"tags": ["store"],"summary": "Returns pet inventories by status","description": "Returns a map of status codes to quantities","operationId": "getInventory","responses": {"200": {"description": "successful operation","content": {"application/json": {"schema": {"type": "object","additionalProperties": {"type": "integer","format": "int32"}}}}}},"security": [{"api_key": []}]}},"/store/order": {"post": {"tags": ["store"],"summary": "Place an order for a pet","description": "","operationId": "placeOrder","responses": {"200": {"description": "successful operation","content": {"application/xml": {"schema": {"$ref": "#/components/schemas/Order"}},"application/json": {"schema": {"$ref": "#/components/schemas/Order"}}}},"400": {"description": "Invalid Order"}},"requestBody": {"content": {"application/json": {"schema": {"$ref": "#/components/schemas/Order"}}},"description": "order placed for purchasing the pet","required": true}}},"/store/order/{orderId}": {"get": {"tags": ["store"],"summary": "Find purchase order by ID","description": "For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions","operationId": "getOrderById","parameters": [{"name": "orderId","in": "path","description": "ID of pet that needs to be fetched","required": true,"schema": {"type": "integer","format": "int64","minimum": 1,"maximum": 10}}],"responses": {"200": {"description": "successful operation","content": {"application/xml": {"schema": {"$ref": "#/components/schemas/Order"}},"application/json": {"schema": {"$ref": "#/components/schemas/Order"}}}},"400": {"description": "Invalid ID supplied"},"404": {"description": "Order not found"}}},"delete": {"tags": ["store"],"summary": "Delete purchase order by ID","description": "For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors","operationId": "deleteOrder","parameters": [{"name": "orderId","in": "path","description": "ID of the order that needs to be deleted","required": true,"schema": {"type": "integer","format": "int64","minimum": 1}}],"responses": {"400": {"description": "Invalid ID supplied"},"404": {"description": "Order not found"}}}},"/user": {"post": {"tags": ["user"],"summary": "Create user","description": "This can only be done by the logged in user.","operationId": "createUser","responses": {"default": {"description": "successful operation"}},"requestBody": {"content": {"application/json": {"schema": {"$ref": "#/components/schemas/User"}}},"description": "Created user object","required": true}}},"/user/createWithArray": {"post": {"tags": ["user"],"summary": "Creates list of users with given input array","description": "","operationId": "createUsersWithArrayInput","responses": {"default": {"description": "successful operation"}},"requestBody": {"$ref": "#/components/requestBodies/UserArray"}}},"/user/createWithList": {"post": {"tags": ["user"],"summary": "Creates list of users with given input array","description": "","operationId": "createUsersWithListInput","responses": {"default": {"description": "successful operation"}},"requestBody": {"$ref": "#/components/requestBodies/UserArray"}}},"/user/login": {"get": {"tags": ["user"],"summary": "Logs user into the system","description": "","operationId": "loginUser","parameters": [{"name": "username","in": "query","description": "The user name for login","required": true,"schema": {"type": "string"}},{"name": "password","in": "query","description": "The password for login in clear text","required": true,"schema": {"type": "string","format": "password"}}],"responses": {"200": {"description": "successful operation","headers": {"X-Rate-Limit": {"description": "calls per hour allowed by the user","schema": {"type": "integer","format": "int32"}},"X-Expires-After": {"description": "date in UTC when token expires","schema": {"type": "string","format": "date-time"}}},"content": {"application/xml": {"schema": {"type": "string"}},"application/json": {"schema": {"type": "string"}}}},"400": {"description": "Invalid username/password supplied"}}}},"/user/logout": {"get": {"tags": ["user"],"summary": "Logs out current logged in user session","description": "","operationId": "logoutUser","responses": {"default": {"description": "successful operation"}}}},"/user/{username}": {"get": {"tags": ["user"],"summary": "Get user by user name","description": "","operationId": "getUserByName","parameters": [{"name": "username","in": "path","description": "The name that needs to be fetched. Use user1 for testing. ","required": true,"schema": {"type": "string"}}],"responses": {"200": {"description": "successful operation","content": {"application/xml": {"schema": {"$ref": "#/components/schemas/User"}},"application/json": {"schema": {"$ref": "#/components/schemas/User"}}}},"400": {"description": "Invalid username supplied"},"404": {"description": "User not found"}}},"put": {"tags": ["user"],"summary": "Updated user","description": "This can only be done by the logged in user.","operationId": "updateUser","parameters": [{"name": "username","in": "path","description": "name that need to be updated","required": true,"schema": {"type": "string"}}],"responses": {"400": {"description": "Invalid user supplied"},"404": {"description": "User not found"}},"requestBody": {"content": {"application/json": {"schema": {"$ref": "#/components/schemas/User"}}},"description": "Updated user object","required": true}},"delete": {"tags": ["user"],"summary": "Delete user","description": "This can only be done by the logged in user.","operationId": "deleteUser","parameters": [{"name": "username","in": "path","description": "The name that needs to be deleted","required": true,"schema": {"type": "string"}}],"responses": {"400": {"description": "Invalid username supplied"},"404": {"description": "User not found"}}}}},"externalDocs": {"description": "See AsyncAPI example","url": "https://mermade.github.io/shins/asyncapi.html"},"components": {"schemas": {"Order": {"type": "object","properties": {"id": {"type": "integer","format": "int64"},"petId": {"type": "integer","format": "int64"},"quantity": {"type": "integer","format": "int32"},"shipDate": {"type": "string","format": "date-time"},"status": {"type": "string","description": "Order Status","enum": ["placed","approved","delivered"]},"complete": {"type": "boolean","default": false}},"xml": {"name": "Order"}},"Category": {"type": "object","properties": {"id": {"type": "integer","format": "int64"},"name": {"type": "string"}},"xml": {"name": "Category"}},"User": {"type": "object","properties": {"id": {"type": "integer","format": "int64"},"username": {"type": "string"},"firstName": {"type": "string"},"lastName": {"type": "string"},"email": {"type": "string"},"password": {"type": "string"},"phone": {"type": "string"},"userStatus": {"type": "integer","format": "int32","description": "User Status"}},"xml": {"name": "User"}},"Tag": {"type": "object","properties": {"id": {"type": "integer","format": "int64"},"name": {"type": "string"}},"xml": {"name": "Tag"}},"Pet": {"type": "object","required": ["name","photoUrls"],"properties": {"id": {"type": "integer","format": "int64"},"category": {"$ref": "#/components/schemas/Category"},"name": {"type": "string","example": "doggie"},"photoUrls": {"type": "array","xml": {"name": "photoUrl","wrapped": true},"items": {"type": "string"}},"tags": {"type": "array","xml": {"name": "tag","wrapped": true},"items": {"$ref": "#/components/schemas/Tag"}},"status": {"type": "string","description": "pet status in the store","enum": ["available","pending","sold"]}},"xml": {"name": "Pet"}},"ApiResponse": {"type": "object","properties": {"code": {"type": "integer","format": "int32"},"type": {"type": "string"},"message": {"type": "string"}}}},"requestBodies": {"Pet": {"content": {"application/json": {"schema": {"$ref": "#/components/schemas/Pet"}},"application/xml": {"schema": {"$ref": "#/components/schemas/Pet"}}},"description": "Pet object that needs to be added to the store","required": true},"UserArray": {"content": {"application/json": {"schema": {"type": "array","items": {"$ref": "#/components/schemas/User"}}}},"description": "List of user object","required": true}},"securitySchemes": {"petstore_auth": {"type": "oauth2","flows": {"implicit": {"authorizationUrl": "http://petstore.swagger.io/oauth/dialog","scopes": {"write:pets": "modify pets in your account","read:pets": "read your pets"}}}},"api_key": {"type": "apiKey","name": "api_key","in": "header"}}}}

var emptyOpenAPI={"openapi":"3.0.0","info":{"title":"Untitled","version":"1.0.0"},"paths":{}};

var jsonSchemaDraft4 = {
"id": "http://json-schema.org/draft-04/schema#",
"$schema": "http://json-schema.org/draft-04/schema#",
"description": "OpenApi 3.0 schema subset",
"definitions": {
    "schemaArray": {
        "type": "array",
        "minItems": 1,
        "items": { "$ref": "#" }
    },
    "positiveInteger": {
        "type": "integer",
        "minimum": 0
    },
    "positiveIntegerDefault0": {
        "allOf": [ { "$ref": "#/definitions/positiveInteger" }, { "default": 0 } ]
    },
    "simpleTypes": {
        "enum": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
    },
    "stringArray": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 1,
        "uniqueItems": true
    }
},
"type": "object",
"properties": {
    "id": {
        "type": "string",
        "format": "uri"
    },
    "$schema": {
        "type": "string",
        "format": "uri"
    },
    "title": {
        "type": "string"
    },
    "description": {
        "type": "string"
    },
    "default": {},
    "multipleOf": {
        "type": "number",
        "minimum": 0,
        "exclusiveMinimum": true
    },
    "maximum": {
        "type": "number"
    },
    "exclusiveMaximum": {
        "type": "boolean",
        "format": "checkbox",
        "default": false
    },
    "minimum": {
        "type": "number"
    },
    "exclusiveMinimum": {
        "type": "boolean",
        "format": "checkbox",
        "default": false
    },
    "maxLength": { "$ref": "#/definitions/positiveInteger" },
    "minLength": { "$ref": "#/definitions/positiveIntegerDefault0" },
    "pattern": {
        "type": "string",
        "format": "regex"
    },
    "additionalItems": {
        "anyOf": [
            { "type": "boolean",
              "format": "checkbox"
            },
            { "$ref": "#" }
        ],
        "default": {}
    },
    "items": {
        "anyOf": [
            { "$ref": "#" },
            { "$ref": "#/definitions/schemaArray" }
        ],
        "default": {}
    },
    "maxItems": { "$ref": "#/definitions/positiveInteger" },
    "minItems": { "$ref": "#/definitions/positiveIntegerDefault0" },
    "uniqueItems": {
        "type": "boolean",
        "format": "checkbox",
        "default": false
    },
    "maxProperties": { "$ref": "#/definitions/positiveInteger" },
    "minProperties": { "$ref": "#/definitions/positiveIntegerDefault0" },
    "required": { "$ref": "#/definitions/stringArray" },
    "additionalProperties": {
        "anyOf": [
            { "type": "boolean",
              "format": "checkbox"
            },
            { "$ref": "#" }
        ],
        "default": {}
    },
    "definitions": {
        "type": "object",
        "additionalProperties": { "$ref": "#" },
        "default": {}
    },
    "properties": {
        "type": "object",
        "additionalProperties": { "$ref": "#" },
        "default": {}
    },
    "patternProperties": {
        "type": "object",
        "additionalProperties": { "$ref": "#" },
        "default": {}
    },
    "enum": {
        "type": "array",
        "minItems": 1,
        "uniqueItems": true
    },
    "type": {
        "anyOf": [
            { "$ref": "#/definitions/simpleTypes" },
            {
                "type": "array",
                "items": { "$ref": "#/definitions/simpleTypes" },
                "minItems": 1,
                "uniqueItems": true
            }
        ]
    },
    "allOf": { "$ref": "#/definitions/schemaArray" },
    "anyOf": { "$ref": "#/definitions/schemaArray" },
    "oneOf": { "$ref": "#/definitions/schemaArray" },
    "dependencies": {
        "type": "object",
        "additionalProperties": {
            "anyOf": [
                { "$ref": "#" },
                { "$ref": "#/definitions/stringArray" }
            ]
        }
    },
    "not": { "$ref": "#" }
},
"dependencies": {
    "exclusiveMaximum": [ "maximum" ],
    "exclusiveMinimum": [ "minimum" ]
},
"default": {}};

var namespaces = [
    { namespace: "guru.apis", enabled: false },
    { namespace: "info.smart-api", enabled: false },
    { namespace: "ly.redoc", enabled: true }
];

var extensions = [
{
  "openapiExtensionFormat": "0.1.0",
  "guru.apis": {
    "x-apiClientRegistration": {
      "summary": "A link to a sign-up page for the API.",
      "description": "A property of the info object, x-apiClientRegistration includes a URL-formatted property url containing the URL to the resource where developers can register to authenticate with the API.",
      "externalDocs": {
        "$ref": "#/components/externalDocs/apis-guru"
      },
      "provider": {
        "$ref": "#/components/providers/apis-guru"
      },
      "schema": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "format": "uri-ref"
          }
        },
        "required": [
          "url"
        ]
      },
      "example": {
        "url": "https://developer.bbc.co.uk/user/register"
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-apisguru-categories": {
      "description": "A property of the info object, `x-apisguru-categories` is an array of valid values from the list of APIs.guru categories.",
      "externalDocs": {
        "$ref": "#/components/externalDocs/apis-guru"
      },
      "provider": {
        "$ref": "#/components/providers/apis-guru"
      },
      "schema": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-description-language": {
      "description": "An ISO-639 two-character language code to identify the natural language used in descriptions, summaries and titles. This can be used as an input to translating these items.",
      "schema": {
        "type": "string"
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-hasEquivalentPaths": {
      "description": "A property of the `root` object, `x-hasEquivalentPaths` indicates the source specification has multiple paths which map to the same OpenAPI path (possibly disambiguated with HTML fragment identifiers or differently named path parameters).",
      "schema": {
        "type": "boolean"
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "SwaggerObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "OpenAPIObject"
        ]
      }
    },
    "x-logo": {
      "summary": "A logo for the API.",
      "description": "A property of the `info` object, the `x-logo` structure holds an absolute URL to the API logo and an optional background colour in HTML hex notation.\n",
      "externalDocs": {
        "$ref": "#/components/externalDocs/apis-guru"
      },
      "provider": {
        "$ref": "#/components/providers/apis-guru"
      },
      "schema": {
        "type": "object",
        "title": "Logo",
        "properties": {
          "url": {
            "type": "string",
            "format": "uri-ref"
          },
          "backgroundColor": {
            "type": "string"
          }
        },
        "required": [
          "url"
        ]
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-origin": {
      "description": "A property of the `info` object, the `x-origin` structure is used to document the source and format of an API in the collection. It is used to round-trip the process of keeping the APIs updated.\n\nPlease note, if you include an x-origin extension within your API definition APIs.guru will then append to this array if it exists, allowing an audit trail of the source(s) of an API definition.\nValid values for format\n\n  * swagger\n  * api_blueprint\n  * raml\n  * google\n\nIn your own `x-origin` entries you may alternatively use a contentType property instead of a format property. The version property is then optional.\n\nYou may also specify the converter and version used.\n",
      "schema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "format": "uri-ref"
            },
            "format": {
              "type": "string",
              "enum": [
                "swagger",
                "api_blueprint",
                "raml",
                "google"
              ]
            },
            "version": {
              "type": "string"
            },
            "contentType": {
              "type": "string"
            },
            "converter": {
              "type": "object",
              "properties": {
                "url": {
                  "type": "string",
                  "format": "uri-ref"
                },
                "version": {
                  "type": "string"
                }
              }
            }
          },
          "required": [
            "url"
          ]
        }
      },
      "example": [
        {
          "url": "http://programmes.api.bbc.com/nitro/api",
          "contentType": "application/json",
          "converter": {
            "url": "https://github.com/mermade/bbcparse",
            "version": "1.2.0"
          }
        },
        {
          "format": "swagger",
          "url": "https://raw.githubusercontent.com/Mermade/bbcparse/master/iblApi/swagger.json",
          "version": "2.0"
        }
      ],
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-preferred": {
      "description": "A property of the `info` object, `x-preferred` is a Boolean property which distinguishes between multiple versions of the same API. Where the `x-providerName` and `x-serviceName` are the same, only one definition should be marked `x-preferred: true`. This helps users of the APIs.guru collection organise and display the APIs.",
      "schema": {
        "type": "boolean"
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-providerName": {
      "description": "A property of the `info` object, `x-providerName` is used to identify the domain of the API host. It is added automatically by APIs.guru",
      "schema": {
        "type": "string"
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-serviceName": {
      "description": "A property of the `info` object, `x-serviceName` is used to distinguish APIs which are served from the same domain. It may be the subdomain if the API uses one. It is added automatically by APIs.guru",
      "schema": {
        "type": "string"
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-tags": {
      "description": "Also a property of the `info` object, `x-tags` is an array of free-form keywords/tags applicable to the API.",
      "schema": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    },
    "x-unofficialSpec": {
      "description": "A property of the `info` object, `x-unofficialSpec` indicates the definition is produced by a third-party, either manually, by scraping existing documentation or converting a proprietary/undocumented format.",
      "schema": {
        "title": "Unofficial spec",
        "type": "boolean"
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    }
  },
  "components": {
    "externalDocs": {
      "apis-guru": {
        "description": "APIs.guru OpenAPI Directory Wiki",
        "url": "https://github.com/APIs-guru/openapi-directory/wiki/specification-extensions"
      }
    },
    "providers": {
      "apis-guru": {
        "name": "APIs.guru",
        "url": "https://apis.guru/"
      }
    }
  }
},
{
  "openapiExtensionFormat": "0.1.0",
  "info.smart-api": {
    "x-id": {
      "summary": "The unique id for the item",
      "description": "A property of the `contact` and `tag` objects, `x-id` holds the unique id for the item. You SHOULD use a URI to specify the concept.",
      "schema": {
        "title": "Unique Id",
        "type": "string"
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "ContactObject",
          "TagObject"
        ]
      }
    },
    "x-externalResources": {
        "summary": "A list of external resources pertinent to the API.",
        "description": "Allows referencing external resources for extended documentation.",
        "schema": {
            "title": "External Resources",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "x-url": {
                        "type": "string",
                        "title": "URL",
                        "description": "URL for the target description"
                    },
                    "x-type": {
                        "title": "Type",
                        "type": "string",
                        "enum": ["api documentation","website","developer forum","mailing list","social media","publication"]
                    },
                    "x-description": {
                        "title": "Description",
                        "type": "string",
                        "description": "A short description of the target documentation",
                        "format": "commonmark"
                    }
                }
            }
        },
        "oas3": {
            "usage": "restricted",
            "objectTypes": [
                "OpenAPIObject"
            ]
        }
    }
  }
},
{
  "openapiExtensionFormat": "0.1.0",
  "ly.redoc": {
    "x-ignoredHeaderParameters": {
      "summary": "Specify header names which are ignored by ReDoc",
      "description": "x-ignoredHeaderParameters is used to specify header parameter names which are ignored by ReDoc",
      "schema": {
        "title": "Ignored headers",
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "OpenAPIObject"
        ]
      }
    },
    "x-tagGroups": {
      "summary": "Group tags in the side menu",
      "description": "x-tagGroups is used to group tags in the side menu. If you are going to use x-tagGroups, please make sure you add all tags to a group, since a tag that is not in a group, will not be displayed at all!",
      "schema": {
        "title": "Tag Groups",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "The group name"
            },
            "tags": {
                "type": "array",
                "description": "List of tags to include in this group",
                "items": {
                    "type": "string"
                }
            }
        }
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "OpenAPIObject"
        ]
      }
    },
    "x-traitTag": {
      "summary": "Is the tag a trait",
      "description": "In OpenAPI operations can have multiple tags. This property distinguish between tags that are used to group operations (default) from tags that are used to mark operation with certain trait (true value). Tags that have x-traitTag set to true are listed in side-menu but don't have any subitems (operations). Tag description is rendered as well. This is useful for handling out common things like Pagination, Rate-Limits, etc.",
      "schema": {
        "type": "boolean",
        "title": "Trait Tag",
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "TagObject"
        ]
      }
    },
    "x-displayName": {
      "summary": "The text that is used for this tag in the menu and in section headings",
      "description": "Define the text that is used for this tag in the menu and in section headings",
      "schema": {
        "type": "string",
        "title": "Display Name"
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "TagObject"
        ]
      }
    },
    "x-logo": {
      "summary": "A logo for the API.",
      "description": "A property of the `info` object, the `x-logo` structure holds an absolute URL to the API logo and an optional background colour in HTML hex notation.\n",
      "externalDocs": {
        "$ref": "#/components/externalDocs/apis-guru"
      },
      "provider": {
        "$ref": "#/components/providers/apis-guru"
      },
      "schema": {
        "type": "object",
        "title": "Logo",
        "properties": {
          "url": {
            "type": "string",
            "format": "uri-ref"
          },
          "backgroundColor": {
            "type": "string"
          }
        },
        "required": [
          "url"
        ]
      },
      "oas2": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      },
      "oas3": {
        "usage": "restricted",
        "objectTypes": [
          "InfoObject"
        ]
      }
    }
  }
}
];
