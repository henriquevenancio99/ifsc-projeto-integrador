using SalonScheduling.Domain.Commands.ClientCommands;
using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Entities
{
    public class Client : BaseEntity
    {
        public required string Name { get; set; }
        public required Contact Contact { get; set; }
        public ICollection<Scheduling>? Schedulings { get; set; }

        public static Client CreateBy(CreateClientCommand command) => new()
        {
            Name = command.Name!,
            Contact = command.Contact!
        };

        public static Client CreateBy(UpdateClientCommand command) => new()
        {
            Name = command.Name!,
            Contact = command.Contact!
        };
    }
}
