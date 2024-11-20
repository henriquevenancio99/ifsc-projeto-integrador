using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Commands.ClientCommands
{
    public record UpdateClientCommand(Guid Id, string Name, Contact Contact) : BaseCommand;
}
