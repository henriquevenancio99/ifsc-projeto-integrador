using FluentValidation;
using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Validators
{
    public class CreateEmplyeeUserCommandValidator : AbstractValidator<CreateEmplyeeUserCommand>
    {
        public CreateEmplyeeUserCommandValidator()
        {
            RuleFor(r => r.Username)
                .NotEmpty();

            RuleFor(r => r.Password)
                .NotEmpty();
        }
    }
}