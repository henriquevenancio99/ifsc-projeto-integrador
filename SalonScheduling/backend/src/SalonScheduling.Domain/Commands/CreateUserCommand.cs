namespace SalonScheduling.Domain.Commands
{
    public record CreateUserCommand(
        string? Username = default,
        string? Password = default,
        string[]? Roles = default) : BaseCommand;
}
