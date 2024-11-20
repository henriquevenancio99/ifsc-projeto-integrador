using FluentValidation;
using SalonScheduling.Domain.Commands.EmployeeCommands;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Validators.EmployeeValidators
{
    public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
    {
        public CreateEmployeeCommandValidator(IEmployeeRepository employeeRepository)
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
                            await employeeRepository.ExistsBy(e => e.Contact.Email == email) is false)
                        .WithMessage(w => $"'{nameof(w.Email)}' informado já existe.");
                })
                .When(w => w.Contact is not null);
        }
    }
}