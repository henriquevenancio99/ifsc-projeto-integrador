using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Commands.EmployeeCommands
{
    public record UpdateEmployeeCommand(
        Guid Id, 
        string Name, 
        Contact Contact,
        Guid[]? SalonServicesIds) : BaseCommand;
}
