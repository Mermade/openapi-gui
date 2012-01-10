require "bundler/setup"
require 'sinatra'
require './partials'
require 'haml'
require 'json'
require 'hashie'

helpers Sinatra::Partials

get '/' do
	haml :start, :format => :html5
end

post '/' do
	 unless params[:file] &&
					(tmpfile = params[:file][:tempfile]) &&
					(name = params[:file][:filename])
		 @error = "No file selected"
		 return haml(:index)
	 end

	 contents = tmpfile.read
	 
	 result = JSON(contents)	
	 @result = Hashie::Mash.new(result)
	 
	 haml :endpoints
end