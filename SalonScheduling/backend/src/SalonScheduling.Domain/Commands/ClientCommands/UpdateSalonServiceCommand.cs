namespace SalonScheduling.Domain.Commands.ClientCommands
{
    public record UpdateSalonServiceCommand(
        Guid Id, 
        string? Name = default,
        decimal? Price = default,
        Dictionary<string, string>? ServiceTypes = default,
        string[]? SelectedSalonServiceTypes = default,
        string? ServiceTime = default,
        string? Description = default
    ) : CreateSalonServiceCommand(Name, Price, ServiceTypes, SelectedSalonServiceTypes, ServiceTime, Description);
}
