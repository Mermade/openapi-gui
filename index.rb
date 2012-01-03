require 'rubygems'
require 'sinatra'
require 'haml'

get '/' do
  haml :index, :format => :html5
end