namespace SalonScheduling.Domain.Commands.ClientCommands
{
    public record CreateSalonServiceCommand(
        string? Name = default,
        decimal? Price = default,
        Dictionary<string, string>? ServiceTypes = default,
        string[]? SelectedSalonServiceTypes = default,
        string? ServiceTime = default,
        string? Description = default) : BaseCommand;
}
