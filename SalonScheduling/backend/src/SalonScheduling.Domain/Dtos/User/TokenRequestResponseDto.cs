namespace SalonScheduling.Domain.Dtos.User
{
    public record TokenRequestResponseDto(string Username, string Token, string RefreshToken);
}
