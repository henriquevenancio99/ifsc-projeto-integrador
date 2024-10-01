namespace SalonScheduling.Domain.Dtos.User
{
    public record ForgetPasswordRequestBodyDto(string Email, string? ClientUriToResetPassword);
}