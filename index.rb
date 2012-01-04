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
   STDERR.puts "Uploading file, original name #{name.inspect}"
   contents = tmpfile.read
   parsed = JSON.parse(contents)
     
   "Upload complete #{parsed.inspect}"
 end