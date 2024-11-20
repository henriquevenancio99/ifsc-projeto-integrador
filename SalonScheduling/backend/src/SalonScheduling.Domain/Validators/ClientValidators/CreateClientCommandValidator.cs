using FluentValidation;
using SalonScheduling.Domain.Commands.ClientCommands;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Validators.ClientValidators
{
    public class CreateClientCommandValidator : AbstractValidator<CreateClientCommand>
    {
        public CreateClientCommandValidator(IClientRepository clientRepository)
        {
            RuleFor(r => r.Name)
                .NotEmpty();

            RuleFor(r => r.Contact)
                .NotNull();

            RuleFor(r => r.Contact)
                .ChildRules(c =>
                {
                    c.RuleFor(r => r!.Email)
                        .EmailAddress()
                        .MustAsync(async (_, email, _) =>
                            await clientRepository.ExistsBy(e => e.Contact.Email == email) is false)
                        .WithMessage(w => $"'{nameof(w.Email)}' informado já existe.");
                })
                .When(w => w.Contact is not null);
        }
    }
}