namespace SalonScheduling.Domain.Dtos.User
{
    public record UserRequestResponseDto(Guid Id, string Username, string[] Roles);
}