class Admin::UserNotesController < Admin::AdminController
  def index
    user_id = params[:user_id]
    render json: UserNote.where(user_id: user_id)
  end

  def create
    user_note = UserNote.create!(user_note_params)
    render json: user_note
  end

  def destroy
    user_note = UserNote.find params[:id]
    user_note.destroy
    render json: user_note
  end

  private

  def user_note_params
    params.require(:user_note).permit(:user_id, :notes)
  end
end
