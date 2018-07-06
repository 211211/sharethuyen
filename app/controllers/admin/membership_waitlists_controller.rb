class Admin::MembershipWaitlistsController < Admin::AdminController
  before_action :membership_waitlist, only: [:approve]
  def index
    respond_to do |format|
      format.html
      format.json { render json: MembershipWaitlistDatatable.new(view_context) }
    end
  end

  def approve
    @membership_waitlist.approved!
    UserMailer.membership_waitlist_approved(@membership_waitlist.user_id).deliver_later
    render json: @membership_waitlist
  end

  private

  def membership_waitlist
    @membership_waitlist = MembershipWaitlist.find(params[:id])
  end
end
