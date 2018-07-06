class Admin::GroupsController < Admin::AdminController
  before_action :get_group, only: [:show, :edit, :update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json { render json: GroupDatatable.new(view_context) }
    end
  end

  def new
  end

  def show
    render json: @group
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @group }
    end
  end

  def create
    @group = Group.new(group_params)
    authorize @group
    user_ids = params[:group][:user_ids]

    if @group.save
      add_users_messages = GroupService.add_users_to_group(@group, user_ids)
      render json: {
        group: @group,
        add_users_messages: add_users_messages
      }
    else
      render :json => { errors: @group.errors }, :status => :bad_request
    end
  end

  def update
    authorize @group
    user_ids = params[:group][:user_ids]

    if @group.update(group_params)
      add_users_messages = GroupService.add_users_to_group(@group, user_ids)
      render json: {
        group: @group,
        add_users_messages: add_users_messages
      }
    else
      render :json => { errors: @group.errors }, :status => :bad_request
    end
  end

  def destroy
    authorize @group
    @group.destroy

    render :json => { group: @group }
  end

  private

    def group_params
      params.require(:group).permit(:name, :membership_type)
    end

    def get_group
      @group = Group.find(params[:id])
    end
end
