// This is a simple *viewmodel* - JavaScript that defines the data and 
// behavior of our UI via KnockoutJS

function AppViewModel() 
{
    var self = this;
    self.endpoints = ko.observableArray([new Endpoint()]);

    self.addEndpoint = function() 
    {
        self.endpoints.push(new Endpoint());
    }

    self.deleteEndpoint = function( item, event ) 
    {
        endpointId = $(event.target).attr('array-loc');
        self.endpoints.splice(endpointId,1);
    }
}

function Endpoint(koData)
{
    var self = this;

    self.id = ko.observable(Math.floor(Math.random()*10000000));
    self.name = ko.observable("Endpoint Name");
    self.methods = ko.observableArray([ new Method() ]);
    self.supportedHTTPMethods = ['GET','POST','PUT','DELETE'];

    ko.mapping.fromJS(koData, knockoutMapping, this);
 
    self.addMethod = function() {
        self.methods.push(new Method());
    };
 
    self.deleteMethod = function( item, event ) 
    {
        methodId = $(event.target).attr('array-loc');
        self.methods.splice(methodId,1);
    }
}

function Method(koData)
{
    var self = this;

    self.id = ko.observable(Math.floor(Math.random()*10000000));
    self.MethodName = ko.observable("Method Name");
    self.Synopsis = ko.observable('');
    self.HTTPMethod = ko.observable('');
    self.URI = ko.observable('');
    self.RequiresOAuth = ko.observable(false);
    self.content = ko.observable();
    self.parameters = ko.observableArray();
    
    ko.mapping.fromJS(koData, knockoutMapping, this);

    self.addParameter = function() {
        self.parameters.push(new Parameter());
    };
 
    self.deleteParameter = function( item, event ) 
    {
        parameterId = $(event.target).attr('array-loc');
        self.parameters.splice(parameterId,1);
    }

    self.addContentSection = function() 
    {
        self.content(new ContentSection());
    };
 
    self.deleteContentSection = function() 
    {
        self.content(null);
    }
}

function Parameter(koData) 
{
    var self = this;

    self.id = ko.observable(Math.floor(Math.random()*10000000));
    self.Name = ko.observable('Name');
    self.Description = ko.observable('');
    self.Default = ko.observable('');
    self.Required = ko.observable(true);
    self.Type = ko.observable('string');
    self.Location = ko.observable('query');

    self.availableTypes = ['bool','integer','string','other'];
    self.availableLocations = ['query', 'header'];

    ko.mapping.fromJS(koData, knockoutMapping, this);

    self.typeInput = ko.computed( function() 
    {
        if ( self.Type() == 'other' || 
             jQuery.inArray(self.Type(), self.availableTypes) == -1 )
        {
            return 'freeform-parameter-type-input';
        }

        return 'list-parameter-type-input';
    });
}

function SchemaParameter(koData)
{
    var self = this;

    self.id = ko.observable(Math.floor(Math.random()*10000000));
    self.Name = ko.observable("Name");
    self.Description = ko.observable("");
    self.Default = ko.observable("");
    self.Required = ko.observable(true);
    self.Type = ko.observable("integer");
    self.parameters = ko.observableArray();
    self.availableTypes = ['bool','integer','string','object','collection','list','other'];

    ko.mapping.fromJS(koData, knockoutSchemaParameterMapping, this);

    self.addParameter = function() {
        self.parameters.push(new SchemaParameter());
    };
 
    self.deleteParameter = function( item, event ) 
    {
        id = $(event.target).attr('array-loc');
        self.parameters.splice(id,1);
    }

    self.displayTemplate = function() 
    {
        if( self.Type() == 'object' || self.Type() == 'collection' || self.Type() == 'list' )
        {
            return "complex-schema";
        }

        return "simple-schema";
    }
}

function ContentSection(koData) 
{
    var self = this;

    self.id = ko.observable(Math.floor(Math.random()*10000000));
    self.schema = {"type":"string"};
    self.contentType = ko.observableArray(["application/json"]);
    self.parameters = ko.observableArray();

    ko.mapping.fromJS(koData, knockoutSchemaParameterMapping, this);

    self.addParameter = function() {
        parameter = new SchemaParameter();    
        self.parameters.push(parameter);
    };
 
    self.deleteParameter = function( item, event ) 
    {
        id = $(event.target).attr('array-loc');
        self.parameters.splice(id,1);
    }
}

// This mapping object allows us to specify the kind of object create when 
// building a view model from a simple object represntation (as we do when 
// loading in JSON data). These mapping definitions are referenced throughout 
// the object definitions up above
// For more see http://knockoutjs.com/documentation/plugins-mapping.html#customizing_object_construction_using_create
var knockoutMapping = {
    'endpoints': {
        create: function(options) {
            return new Endpoint(options.data);
        }
    },
    'methods': {
        create: function(options) {
            return new Method(options.data);
        }
    },
    'parameters': {
        create: function(options) {
            return new Parameter(options.data);
        }
    },
    'schemaParameters': {
        create: function(options) {
            return new SchemaParameter(options.data);
        }
    },
    'content': {
        create: function(options) {
            return new ContentSection(options.data);
        }
    }
}

// We need a distinct definition of what a 'parameter' is because inside the 
// Section Content and SchemaParameter objects a parameter is a slightly 
// different object. Obviously I could change the name of the array in those 
// objects so that they don't collide however the name is significant in that 
// I/O Docs looks for that element by name so the output must have the name 
// 'parameters'. There are a couple of ways to skin this cat, I chose this way.
var knockoutSchemaParameterMapping = {
    'parameters': {
        create: function(options) {
            return new SchemaParameter(options.data);
        }
    }
}

/**
 * This is a simple helper method to recursivly prune away named variables from 
 * an object and its children. We do this because we're doing a 'dump' of the 
 * javascript object to JSON and there are several bits of data that we use 
 * during the construction and management of the endpoint that we don't want 
 * translated into the output.
 */
function cleanUp(obj)
{
    delete obj.__ko_mapping__;

    for( var i in obj ) 
    {
        if( typeof(obj[i]) == "object" && obj[i] != null)
        {
            delete obj[i].id;
            delete obj[i].availableTypes;
            delete obj[i].__ko_mapping__;
            delete obj[i].supportedHTTPMethods;
            delete obj[i].availableLocations;
            delete obj[i].typeInput;

            cleanUp(obj[i]);
        }
    }
}