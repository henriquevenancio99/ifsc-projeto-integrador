using SalonScheduling.Domain.Commands.EmployeeCommands;
using SalonScheduling.Domain.Dtos.Employee;
using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Entities
{
    public class Employee : BaseEntity
    {
        public required string Name { get; set; }
        public required Contact Contact { get; set; }
        public Guid? UserId { get; set; }
        public Dictionary<string, WorkShiftDto[]>? Availability { get; set; }
        public ICollection<SalonService>? SalonServices { get; set; }
        public ICollection<Scheduling>? Schedulings { get; set; }

        public static Employee CreateBy(CreateEmployeeCommand command) => new()
        {
            Name = command.Name!,
            Contact = command.Contact!,
            Availability = command.Availability
        };

        public static Employee CreateBy(UpdateEmployeeCommand command) => new()
        {
            Id = command.Id!,
            Name = command.Name,
            Contact = command.Contact
        };

        public void UpdateProperties(UpdateEmployeeCommand command)
        {
            Name = command.Name;
            Contact = command.Contact;
            Availability = command.Availability;
        }
    }
}
