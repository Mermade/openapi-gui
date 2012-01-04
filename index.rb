require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'

get '/' do
  haml :index, :format => :html5
end

post '/:config' do
  @parsed = JSON.parse()
end

post '/' do
   unless params[:file] &&
          (tmpfile = params[:file][:tempfile]) &&
          (name = params[:file][:filename])
     @error = "No file selected"
     return haml(:index)
   end

   contents = tmpfile.read
   result = JSON.parse(contents)
  
   result['endpoints'].each do |endpoint|
    puts endpoint
   end
  
   if result.has_key? 'Error'
      "Error parsing JSON. Try validating it with JSON Lint."
   else
     #now we've got a parsed config
     #for each endpoint in endpoints
     result['endpoints'].each do |endpoint|
      puts endpoint
     end
     
 
    end
 end