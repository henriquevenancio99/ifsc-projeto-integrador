namespace SalonScheduling.Domain.Dtos.User
{
    public record UserDto(string Username, string Password, string[] Roles);
    public record EditUserDto(string Username, string[] Roles);
}
