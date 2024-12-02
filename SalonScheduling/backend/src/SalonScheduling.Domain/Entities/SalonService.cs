using SalonScheduling.Domain.Commands.ClientCommands;

namespace SalonScheduling.Domain.Entities
{
    public class SalonService : BaseEntity
    {
        public required string Name { get; set; }
        public decimal? Price { get; set; }
        public SalonServiceType[] ServiceTypes { get; set; } = [];
        public TimeOnly? ServiceTime { get; set; }
        public string? Description { get; set; }
        public ICollection<Employee>? Employees { get; set; }

        public static SalonService CreateBy(CreateSalonServiceCommand command) => new()
        {
            Name = command.Name!,
            Price = command.Price,
            ServiceTypes = command.ServiceTypes
                ?.Where(w => (command.SelectedSalonServiceTypes ?? []).Contains(w.Key))
                .Select(s => new SalonServiceType 
                { 
                    Key = s.Key, 
                    Name = s.Value
                })
                .ToArray() ?? [],
            ServiceTime = string.IsNullOrEmpty(command.ServiceTime) ? null : TimeOnly.ParseExact(command.ServiceTime, "HH:mm"),
            Description = command.Description,
        };
    }
}
