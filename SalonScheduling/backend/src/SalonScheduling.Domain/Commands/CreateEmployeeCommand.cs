using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Commands
{
    public record CreateEmployeeCommand(string Name, Contact Contact) : BaseCommand;
}
