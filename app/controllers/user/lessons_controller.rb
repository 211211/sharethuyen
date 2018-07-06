class User::LessonsController < User::UserController
  def index
    @lessons = Lesson.all
    respond_to do |format|
      format.html
      format.json { render json: @lessons }
    end
  end

  def show
    @lesson = Lesson.find params[:id]
    respond_to do |format|
      format.html
      format.json { render json: @lesson }
    end
  end

  def book
    @lesson = Lesson.find params[:id]

    if @lesson.create_booking(current_user, lesson_book_params[:date], lesson_book_params[:payment_methods])
      LessonMailer.send_lesson_booking_to_admin(current_user.id, @lesson.id, lesson_book_params[:date]).deliver_later
      LessonMailer.send_lesson_booking_to_user(current_user.id, @lesson.id, lesson_book_params[:date]).deliver_later

      user_serialized = ActiveModelSerializers::SerializableResource.new(current_user.reload)

      render json: { result: :success, user: user_serialized.as_json}
    else
      render json: { result: :fail }
    end
  end

  private
  def lesson_book_params
    params.require(:lesson).permit(:date, payment_methods: [])
  end
end
