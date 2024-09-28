using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Commands
{
    public record CreateEmployeeCommand(
        string? Name = default, 
        Contact? Contact = default, 
        bool? CreateUser = default, 
        string? UserPassword = default, 
        string[]? UserRoles = default) : BaseCommand;
    
    public record CreateEmplyeeUserCommand(
        string? Username = default, 
        string? Password = default, 
        string[]? Roles = default) : BaseCommand;
}
