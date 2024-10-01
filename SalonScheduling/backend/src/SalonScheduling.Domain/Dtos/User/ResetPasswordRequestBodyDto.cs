namespace SalonScheduling.Domain.Dtos.User
{
    public record ResetPasswordRequestBodyDto(string? Email, string? Token, string? NewPassword, string? ConfirmedPassword);
}