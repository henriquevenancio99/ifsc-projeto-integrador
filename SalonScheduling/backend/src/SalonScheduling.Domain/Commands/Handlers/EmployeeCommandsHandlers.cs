using FluentValidation.Results;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Validators;

namespace SalonScheduling.Domain.Commands.Handlers
{
    public class EmployeeCommandsHandlers(IEmployeeRepository employeeRepository, IIdentityManager identityUserService) :
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
            await employeeRepository.Create(employee);

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

            var employee = Employee.CreateBy(command);

            isValid = await employeeRepository.UpdateAndCommit(command.Id, employee) > 0;

            if(isValid is false)
                ValidationFailures.Add(new(nameof(command.Id), "Usuário não existe"));

            return isValid;
        }

        public async Task<bool> Handle(CreateEmplyeeUserCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return false;
            }

            await identityUserService.CreateUser(new(command.Username!, command.Password!, command.Roles!));

            if (identityUserService.HasValidationFailures)
            {
                ValidationFailures = identityUserService.ValidationFailures;
                return false;
            }

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

        public virtual Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(CreateEmplyeeUserCommand command)
        {
            var result = new CreateEmployeeUserCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }

        public virtual async Task<bool> CreateEmployeeUser(CreateEmployeeCommand command) =>
            command.CreateUser is null or false ||
            await Handle(new CreateEmplyeeUserCommand(command.Contact!.Email, command.UserPassword, command.UserRoles));
    }
}
