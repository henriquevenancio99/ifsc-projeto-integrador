using FluentValidation.Results;
using SalonScheduling.Domain.Commands;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Validators;

namespace SalonScheduling.Domain.CommandsHandlers
{
    public class EmployeeCommandsHandlers(IEmployeeRepository employeeRepository) : 
        BaseCommandsHandlers, IEmployeeCommandsHandlers
    {
        public async Task<Guid> Handle(CreateEmployeeCommand command)
        {
            (var isValid, var errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return default;
            }

            var employee = Employee.CreateBy(command);

            await employeeRepository.Create(employee);
            await employeeRepository.Commit();

            return employee.Id;
        }

        public async Task<bool> Handle(UpdateEmployeeCommand command)
        {
            (var isValid, var errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return false;
            }

            var employee = Employee.CreateBy(command);

            await employeeRepository.Update(command.Id, employee);
            await employeeRepository.Commit();

            return true;
        }

        public async Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(CreateEmployeeCommand command)
        {
            var result = await new CreateEmployeeCommandValidator(employeeRepository).ValidateAsync(command);

            return (result.IsValid, result.Errors);
        }

        public Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(UpdateEmployeeCommand command)
        {
            var result = new UpdateEmployeeCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }
    }
}
