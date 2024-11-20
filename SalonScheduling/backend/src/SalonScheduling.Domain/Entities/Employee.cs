using SalonScheduling.Domain.Commands.EmployeeCommands;
using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Entities
{
    public class Employee : BaseEntity
    {
        public required string Name { get; set; }
        public required Contact Contact { get; set; }
        public Guid? UserId { get; set; }

        public static Employee CreateBy(CreateEmployeeCommand command) => new()
        {
            Name = command.Name!,
            Contact = command.Contact!
        };

        public static Employee CreateBy(UpdateEmployeeCommand command) => new()
        {
            Name = command.Name,
            Contact = command.Contact
        };
    }
}
