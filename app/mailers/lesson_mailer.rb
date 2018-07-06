class LessonMailer < ApplicationMailer
  def send_lesson_booking_to_user(user_id, lesson_id, date)
    user = User.find user_id
    lesson = Lesson.find lesson_id
    date = date

    subject = Setting.email_new_lesson_notification_subject
    email_content = RenderEmailContent.new(
        "email_new_lesson_notification",
        {
            user_first_name: user.first_name,
            user_full_name: user.full_name,
            user_phone: user.phone,
            user_email: user.email,
            lesson_name: lesson.name,
            date: date
        }
    ).perform

    mail(to: user.email, subject: subject, body: email_content)
  end

  def send_lesson_booking_to_admin(user_id, lesson_id, date)
    @user = User.find user_id
    @lesson = Lesson.find lesson_id
    @date = date

    email = Setting.admin_email
    raise "Admin Email haven't configured yet!" if email.blank?
    mail(to: email, subject: 'New Lesson Booking')
  end
end
