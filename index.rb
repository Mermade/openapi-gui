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

get '/about' do
	haml :about
end 

post '/' do
	 unless params[:file] &&
					(tmpfile = params[:file][:tempfile]) &&
					(name = params[:file][:filename])
					
		 if params[:load]
				return haml :start
		 end
		 
		 @result = Hash.new
		 @result["endpoints"] = Hash.new
		 return haml(:endpoints)
	 end

	 contents = tmpfile.read
	 
	 result = JSON(contents)	
	 @result = Hashie::Mash.new(result)
	 
	 haml :endpoints
end

post '/file' do 
	content_type 'application/json'
	attachment 'config.json'
	response.write params[:json]
end