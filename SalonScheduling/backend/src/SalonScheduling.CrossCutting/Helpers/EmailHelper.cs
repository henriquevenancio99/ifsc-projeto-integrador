using System.Net;
using System.Net.Mail;

namespace SalonScheduling.CrossCutting.Helpers
{
    public record EmailCredentials(string Email, string Password);

    public static class EmailHelper
    {
        public async static Task SendEmail(
            EmailCredentials emailCredentials, string toEmail, string subject, string message)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(emailCredentials.Email, emailCredentials.Password),
                EnableSsl = true,
            };

            await smtpClient.SendMailAsync(new MailMessage(emailCredentials.Email, toEmail, subject, message));
        }
    }
}
