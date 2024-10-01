using FluentValidation;
using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Validators
{
    public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
    {
        public UpdateEmployeeCommandValidator()
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