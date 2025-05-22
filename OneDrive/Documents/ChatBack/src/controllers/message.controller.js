import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
 export const getUsersForSidebar = async(req,res) =>{
    try { 
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers)
        
    } catch (error) {
        console.error("Error in getUSersForSidebars",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    // Format the createdAt field in a readable format
    const formattedMessages = messages.map(message => ({
      ...message.toObject(),
      createdAt: new Date(message.createdAt).toLocaleString(),  // Format createdAt
    }));

    // Log the formatted messages
    console.log('Formatted Messages:', formattedMessages);

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const sendMessage  = async(req,res) =>{

  try {
  const {text,image} = req.body;
  const {id:receiverId} = req.params;
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: "Unauthorized: User not authenticated" });
}
  const senderId = req.user._id;
  let imageUrl;
   if(image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
   }

   const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image:imageUrl,
   });
   await newMessage.save();


res.status(201).json({newMessage});
  } catch (error) {
    console.log("error in sendmessage controller",error.message);
    res.status(500).json({error:"internal server error"})
  }
};
