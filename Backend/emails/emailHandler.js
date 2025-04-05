import { MailtrapClient } from "mailtrap";
import { sender } from "../lib/mailtrap.js";
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplete.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];

  try {
    const response = await MailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Linkedin Clone",
      html: createWelcomeEmailTemplate(name, profileUrl),
    });
    console.log("Welcome email send successfully");
  } catch (error) {
    console.log("Error in send welcome email", error);
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const recipient = [{ email:recipientEmail }];

  try {
    const response = await MailtrapClient.send({
        from:sender,
        to:recipient,
        subject:"New comment on your Post",
        html:createCommentNotificationEmailTemplate(recipientName,commenterName,postUrl,commentContent),
        category:"comment_notification"
    })
    console.log("Comment Notification send successfully");
    
  } catch (error) {
      console.log("Error in sending comment Notification",error);
  }
};

export const sendConnectionAcceptedEmail =async(senderEmail,senderName,recipientName,profileUrl)=>{
   const recipient = [{email:senderEmail}]
   try {
    const response = await MailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(senderName,recipientName, profileUrl),
      category:"connection_accepted"
    });
   } catch (error) {
    
   }
}