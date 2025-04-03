import {MailtrapClient} from 'mailtrap'
import dotenv from 'dotenv'

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN

export const mailtrapClient = new MailtrapClient({
    token:TOKEN
})

export const sender = {
    email:process.env.EMAIL_FORM,
    name:process.env.EMAIL_FORM_NAME
}