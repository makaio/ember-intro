class Api::V1::TopicsController < ApplicationController
  respond_to :json

  def index
    @topics = Topic.all
    respond_with @topics
  end

  def show
    @topic = Topic.find(params[:id])
    respond_with @topic
  end
end
