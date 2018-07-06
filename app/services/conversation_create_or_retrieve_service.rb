class ConversationCreateOrRetrieveService
  def initialize(sender, recevier)
    @sender = sender
    @recevier = recevier
  end

  def perform
    Conversation.where(
      "(creator_id = ? and member_id = ?) or (creator_id = ? and member_id = ?)",
      @sender.id, @recevier.id, @recevier.id, @sender.id
    ).first_or_create do |conversation|
      conversation.creator = @sender
      conversation.member = @recevier
    end
  end
end
