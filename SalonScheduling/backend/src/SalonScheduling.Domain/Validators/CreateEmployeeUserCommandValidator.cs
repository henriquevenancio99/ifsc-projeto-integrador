using FluentValidation;
using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Validators
{
    public class CreateEmployeeUserCommandValidator : AbstractValidator<CreateEmplyeeUserCommand>
    {
        public CreateEmployeeUserCommandValidator()
        {
            RuleFor(r => r.Username)
                .NotEmpty();

            RuleFor(r => r.Password)
                .NotEmpty();
        }
    }
}