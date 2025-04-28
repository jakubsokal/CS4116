// pages/api/conversations/[chatId].js

export default async function handler(req, res) {
    const {
      query: { chatId },
    } = req;
  
    // Query the database to get the inquiry_id
    const conversation = await getConversationByChatId(chatId);
  
    if (conversation) {
      res.status(200).json({ inquiry_id: conversation.inquiry_id });
    } else {
      res.status(404).json({ error: "Conversation not found" });
    }
  }
  