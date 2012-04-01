require "bundler/setup"
require 'sinatra'
require 'sinatra/config_file'
require './partials'
require 'haml'
require 'json'
require 'hashie'

config_file 'iodoctor.yml'

helpers Sinatra::Partials

get '/' do
	haml :start, :format => :html5
end

post '/' do
    @version = settings.version
    @show_bottom_bar = true
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