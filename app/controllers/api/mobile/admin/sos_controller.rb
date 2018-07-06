class Api::Mobile::Admin::SosController < Api::Mobile::Admin::AdminController
  before_action :get_sos, only: [:answer, :resolve]
  def index
    offset = params[:page].to_i * num_item_per_page
    sos = Sos.where(resolved: false)
    sos = sos.where("sos_type IN (?)", params[:types].split(",")) if params[:types]
    sos = sos.order("id DESC").limit(num_item_per_page).offset(offset)
    render json: sos
  end

  def answer
    answer = SosResponse.new(
      sos_id: @sos.id,
      message: params[:message],
      user: current_user
    )

    FcmSendUserService.new(
      user: @sos.user,
      title: "#{Setting.site_name} - SOS response",
      body: params[:message]
    ).perform
    
    if answer.save
      @sos.update_attributes(resolved: true)
      render json: answer
    else
      render json: { errors: answer.errors }, status: :bad_request
    end
  end

  def resolve
    @sos.resolved = true
    if @sos.save
      FirebaseAdminService.new.sync_num_of_sos
      render json: {message: "Resolve succesfully!"}
    else
      render json: {errors: @sos.errors}, status: :bad_request
    end
  end

  private

  def get_sos
    @sos = Sos.find(params[:id])
  end
end
