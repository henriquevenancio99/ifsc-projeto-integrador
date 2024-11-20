using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Dtos.Client
{
    public record UpdateClientRequestBodyDto(string Name, Contact Contact);
}
