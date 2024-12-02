using FluentValidation.Results;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands.EmployeeCommands;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Validators.EmployeeValidators;

namespace SalonScheduling.Domain.Commands.Handlers
{
    public class EmployeeCommandsHandlers(IEmployeeRepository employeeRepository, IUserCommandsHandlers userCommandsHandlers) :
        ValidatorHelper, IEmployeeCommandsHandlers
    {
        public async Task<Guid> Handle(CreateEmployeeCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return default;
            }

            var employee = Employee.CreateBy(command);
            await employeeRepository.CreateWithSalonServices(employee, command.SalonServicesIds);

            if (await CreateEmployeeUser(command) is false)
                return default;

            await employeeRepository.Commit();

            return employee.Id;
        }

        public async Task<bool> Handle(UpdateEmployeeCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return false;
            }

            var employee = await employeeRepository.GetByIdWithSalonService(command.Id);

            if (employee is null)
            {
                ValidationFailures.Add(new(nameof(command.Id), "Funcionário não existe"));
                return false;
            }

            employee.UpdateProperties(command);
            await employeeRepository.UpdateWithSalonServices(employee, command.SalonServicesIds);

            await employeeRepository.Commit();

            return true;
        }

        public virtual async Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(CreateEmployeeCommand command)
        {
            var result = await new CreateEmployeeCommandValidator(employeeRepository).ValidateAsync(command);

            return (result.IsValid, result.Errors);
        }

        public virtual Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(UpdateEmployeeCommand command)
        {
            var result = new UpdateEmployeeCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }

        public virtual async Task<bool> CreateEmployeeUser(CreateEmployeeCommand command) =>
            command.CreateUser is null or false ||
            await userCommandsHandlers.Handle(new(command.Contact!.Email, command.UserPassword, command.UserRoles));
    }
}
