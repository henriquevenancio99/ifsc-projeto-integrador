using FluentValidation;
using SalonScheduling.Domain.Commands.ClientCommands;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Validators.SalonServiceValidators
{
    public class CreateSalonServiceCommandValidator : AbstractValidator<CreateSalonServiceCommand>
    {
        public CreateSalonServiceCommandValidator(ISalonServiceRepository salonServiceRepository)
        {
            RuleFor(r => r.Name)
                .NotEmpty()
                .WithMessage(w => $"'{nameof(w.Name)}' deve ser informado.")
                .MustAsync(async (name, _) => await salonServiceRepository.ExistsBy(e => e.Name == name) is false)
                .WithMessage(w => $"'{nameof(w.Name)}' informado já existe.");
        }
    }
}