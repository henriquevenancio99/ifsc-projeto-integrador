using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Commands.ClientCommands
{
    public record CreateClientCommand(
        string? Name = default,
        Contact? Contact = default,
        bool? CreateUser = default,
        string? UserPassword = default) : BaseCommand;
}
