using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Dtos
{
    public record UpdateEmployeeRequestBodyDto(string Name, Contact? Contact);
}
