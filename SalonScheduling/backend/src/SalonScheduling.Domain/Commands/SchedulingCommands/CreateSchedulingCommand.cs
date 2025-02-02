
namespace SalonScheduling.Domain.Commands.SchedulingCommands
{
    public record CreateSchedulingCommand(
        Guid Id, 
        Guid ClientId, 
        Guid[] EmployeesIds, 
        Guid[] SalonServicesIds, 
        string Start, 
        string End
    ) : BaseCommand;
}
