namespace SalonScheduling.Domain.Dtos.User
{
    public record UserDto(string Email, string Password, string[] Roles);
}
