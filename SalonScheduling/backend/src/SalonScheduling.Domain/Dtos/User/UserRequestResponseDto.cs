namespace SalonScheduling.Domain.Dtos.User
{
    public record UserRequestResponseDto(Guid Id, string UserName, string[] Roles);
}