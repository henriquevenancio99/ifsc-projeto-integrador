using FluentValidation;
using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Validators.UserValidators
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        public CreateUserCommandValidator()
        {
            RuleFor(r => r.Username)
                .NotEmpty();

            RuleFor(r => r.Password)
                .NotEmpty();

            RuleFor(r => r.Roles)
                .NotEmpty();
        }
    }
}