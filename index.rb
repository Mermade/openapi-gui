require "bundler/setup"
require 'sinatra'
require 'haml'
require 'json'
require 'hashie'

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
   
   result = JSON(contents)  
   mash = Hashie::Mash.new(result)
   output = ""

   
   mash.endpoints.each do |e|
     output << "#{e.name} <br/>"
   end
   
   return output
end