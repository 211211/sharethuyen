class Sos < ApplicationRecord
  belongs_to :user
  belongs_to :booking

  has_many :sos_responses, dependent: :destroy

  # Inorder to navigate to latest conversation from a SOS
  def conversation
    Conversation
      .where("creator_id = ? or member_id = ?", user_id, user_id)
      .order("latest_message_id DESC").first
  end
end
