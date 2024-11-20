using FluentValidation;
using SalonScheduling.Domain.Commands.ClientCommands;

namespace SalonScheduling.Domain.Validators.ClientValidators
{
    public class UpdateClientCommandValidator : AbstractValidator<UpdateClientCommand>
    {
        public UpdateClientCommandValidator()
        {
            RuleFor(r => r.Id)
                .NotEmpty();

            RuleFor(r => r.Name)
                .NotEmpty();

            RuleFor(r => r.Contact)
                .ChildRules(c => c.RuleFor(r => r.Email).EmailAddress());
        }
    }
}