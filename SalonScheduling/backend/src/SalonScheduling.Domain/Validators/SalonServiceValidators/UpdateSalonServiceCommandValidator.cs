using FluentValidation;
using SalonScheduling.Domain.Commands.ClientCommands;

namespace SalonScheduling.Domain.Validators.SalonServiceValidators
{
    public class UpdateSalonServiceCommandValidator : AbstractValidator<CreateSalonServiceCommand>
    {
        public UpdateSalonServiceCommandValidator()
        {
            RuleFor(r => r.Name)
                .NotEmpty()
                .WithMessage(w => $"'{nameof(w.Name)}' deve ser informado.");
        }
    }
}