class Admin::LessonsController < ApplicationController
  before_action :get_lesson, only: [:show, :edit, :update, :destroy]

  def index
    @lessons = Lesson.all.order(id: :desc)
    respond_to do |format|
      format.html
      format.json { render json: LessonDatatable.new(view_context) }
    end
  end

  def show
    render json: @lesson
  end

  def new
    @lesson = Lesson.new
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @lesson }
    end
  end

  def create
    @lesson = Lesson.new(lesson_params)
    authorize @lesson

    if @lesson.save
      render json: @lesson
    else
      render :json => { errors: @lesson.errors }, :status => :bad_request
    end
  end

  def update
    authorize @lesson

    if @lesson.update(lesson_params)
      render json: @lesson
    else
      render :json => { errors: @lesson.errors }, :status => :bad_request
    end
  end

  def destroy
    authorize @lesson
    @lesson.destroy
    render json: @lesson
  end

  def book
    if request.post?
      lesson = Lesson.find book_lesson_params[:id]
      user = User.find book_lesson_params[:user_id]

      if lesson.create_booking(user, book_lesson_params[:date],
                               book_lesson_params[:payment_methods], true,
                               book_lesson_params[:discount_percent])
        LessonMailer.send_lesson_booking_to_admin(user.id, lesson.id, book_lesson_params[:date]).deliver_later
        LessonMailer.send_lesson_booking_to_user(user.id, lesson.id, book_lesson_params[:date]).deliver_later

        user_serialized = ActiveModelSerializers::SerializableResource.new(user.reload)

        render json: { result: :success, user: user_serialized.as_json}
      else
        render json: { result: :fail }
      end
    end
  end

  def search
    @lessons = Lesson.all
    respond_to do |format|
      format.json { render json: @lessons }
    end
  end

  private

  def lesson_params
    params.require(:lesson).permit!
  end

  def book_lesson_params
    params.require(:lesson).permit(:id, :user_id, :date, :discount_percent, payment_methods: [])
  end

  def get_lesson
    @lesson = Lesson.find(params[:id])
  end
end
