using SalonScheduling.CrossCutting.Extensions;
using SalonScheduling.Domain.Commands.SchedulingCommands;

namespace SalonScheduling.Domain.Entities;

public class Scheduling : BaseEntity
{
    public required DateTimeOffset Start { get; set; }
    public required DateTimeOffset End { get; set; }
    public Guid? ClientId { get; set; }

    public Client? Client { get; set; }
    public ICollection<SalonService>? SalonServices { get; set; }
    public ICollection<Employee>? Employees { get; set; }

    public static Scheduling CreateBy(
        CreateSchedulingCommand command, Client client, List<Employee> employees, List<SalonService> salonServices) => new()
        {
            Id = command.Id,
            ClientId = client.Id,
            Client = client,
            Employees = employees,
            SalonServices = salonServices,
            Start = command.Start.ToDateTimeOffsetUtc(),
            End = command.End.ToDateTimeOffsetUtc(),
        };

    public void UpdateProperties(
        UpdateSchedulingCommand command, Client client, List<Employee> employees, List<SalonService> salonServices)
    {
        Id = command.Id;
        ClientId = client.Id;
        Client = client;
        Employees = employees;
        SalonServices = salonServices;
        Start = command.Start.ToDateTimeOffsetUtc();
        End = command.End.ToDateTimeOffsetUtc();
    }
}
