namespace SalonScheduling.Domain.Dtos.User
{
    public record EditUserDto(string Username, string[] Roles)
    {
        public static implicit operator UserDto(EditUserDto dto) =>
            new(dto.Username, Password: string.Empty, dto.Roles);
    }
}
