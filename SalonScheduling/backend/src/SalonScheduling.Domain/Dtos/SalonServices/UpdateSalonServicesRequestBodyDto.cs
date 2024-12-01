namespace SalonScheduling.Domain.Dtos.SalonService
{
    public record UpdateSalonServiceRequestBodyDto(
        string? Name = default, 
        decimal? Price = default,
        Dictionary<string, string>? ServiceTypes = default,
        string[]? SelectedSalonServiceTypes = default,
        string? ServiceTime = default,
        string? Description = default);
}
