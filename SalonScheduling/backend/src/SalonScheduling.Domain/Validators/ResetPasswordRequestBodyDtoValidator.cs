using FluentValidation;
using SalonScheduling.Domain.Dtos.User;

namespace SalonScheduling.Domain.Validators
{
    public class ResetPasswordRequestBodyDtoValidator : AbstractValidator<ResetPasswordRequestBodyDto>
    {
        public ResetPasswordRequestBodyDtoValidator()
        {
            RuleFor(r => r.Email)
                .NotEmpty();

            RuleFor(r => r.Token)
                .NotEmpty();

            RuleFor(r => r.NewPassword)
                .NotEmpty();

            RuleFor(r => r.ConfirmedPassword)
                .NotEmpty();

            RuleFor(r => r.ConfirmedPassword)
                .Must((dto, confirmedPassword) => dto.NewPassword!.Equals(confirmedPassword))
                .When(w => string.IsNullOrEmpty(w.NewPassword) is false);
        }
    }
}