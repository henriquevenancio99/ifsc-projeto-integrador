namespace SalonScheduling.Domain.Commands.SchedulingCommands
{
    public record UpdateSchedulingCommand(
        Guid Id,
        Guid ClientId,
        Guid[] EmployeesIds,
        Guid[] SalonServicesIds,
        string Start,
        string End
    ) : BaseCommand;
}
