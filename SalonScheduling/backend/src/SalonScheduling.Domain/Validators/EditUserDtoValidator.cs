using FluentValidation;
using SalonScheduling.Domain.Dtos.User;

namespace SalonScheduling.Data.Identity
{
    public class EditUserDtoValidator : AbstractValidator<EditUserDto>
    {
        public EditUserDtoValidator()
        {
            RuleFor(r => r.Username)
                .NotEmpty()
                .EmailAddress();
        }
    }
}
