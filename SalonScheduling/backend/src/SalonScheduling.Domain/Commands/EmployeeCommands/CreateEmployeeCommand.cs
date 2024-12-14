﻿using SalonScheduling.Domain.Dtos.Employee;
using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Commands.EmployeeCommands
{
    public record CreateEmployeeCommand(
        string? Name = default,
        Contact? Contact = default,
        bool? CreateUser = default,
        string? UserPassword = default,
        string[]? UserRoles = default,
        Guid[]? SalonServicesIds = default, 
        Dictionary<string, WorkShiftDto[]>? Availability = default) : BaseCommand;
}
