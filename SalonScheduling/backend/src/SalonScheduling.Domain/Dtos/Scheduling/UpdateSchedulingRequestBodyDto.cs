namespace SalonScheduling.Domain.Dtos.Scheduling
{
    public record UpdateSchedulingRequestBodyDto(
        Guid ClientId,
        Guid[] EmployeesIds,
        Guid[] SalonServicesIds,
        string Start,
        string End
    );
}
