import { MailtrapClient } from "mailtrap"
import { sender } from "../lib/mailtrap.js"
import { createWelcomeEmailTemplate } from "./emailTemplete.js"


 export const sendWelcomeEmail = async(email,name,profileUrl)=>{
    const recipient = [{email}]

    try {
        const response = await MailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Welcome to Linkedin Clone",
            html:createWelcomeEmailTemplate(name,profileUrl)
        })
        console.log("Welcome email send successfully");
        
    } catch (error) {
        console.log("Error in send welcome email", error);
        
    }
 }