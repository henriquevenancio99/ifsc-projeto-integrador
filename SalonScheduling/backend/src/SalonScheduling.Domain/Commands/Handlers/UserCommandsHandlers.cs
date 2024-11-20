using FluentValidation.Results;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Interfaces;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Validators.UserValidators;

namespace SalonScheduling.Domain.Commands.Handlers
{
    public class UserCommandsHandlers(IIdentityManager identityUserService) : ValidatorHelper, IUserCommandsHandlers
    {
        public async Task<bool> Handle(CreateUserCommand command)
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

        public virtual Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(CreateUserCommand command)
        {
            var result = new CreateUserCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }
    }
}
