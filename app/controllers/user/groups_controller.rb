class User::GroupsController < User::UserController
  layout :layout_by_action
  before_action :authenticate_user!, except: [:join]
  before_action :get_group, only: [:index, :send_invitations, :join, :join_now, :remove_invitation]

  def index
    if @group.present?
      render json: @group
    else
      render json: []
    end
  end

  def send_invitations
    render json: @group.send_invitations(params[:emails], current_user)
  end

  def remove_invitation
    if @group.remove_pending_invitation params["email"]
      render_message_growl t(:remove_invitation_out_of_group_successfully)
    else
      render_message_error_growl t(:email_not_belong_group)
    end
  end

  def join
    user = current_user || User.find_by(email: params[:email])
    @status = :failed and return unless user

    if !user.is_paid_membership_charges && @group.remove_pending_invitation(user.email)
      @group.users << user
      @status = :ok
    else
      @status = :failed
    end
  end

  def join_now
    @group.users << current_user
    if @group.remove_pending_invitation current_user.email
      render_message_growl t(:join_group_successfully)
    else
      render_message_error_growl t(:email_not_belong_group)
    end
  end

  private
  def layout_by_action
    action_name == 'join' ? 'no_layout' : 'application'
  end

  def get_group
    if params[:id].present?
      @group = Group.find params[:id]
    else
      user = User.find current_user.id
      @group = user.group
    end
  end
end
