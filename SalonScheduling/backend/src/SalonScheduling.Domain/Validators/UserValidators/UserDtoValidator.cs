using FluentValidation;
using SalonScheduling.Domain.Dtos.User;
using SalonScheduling.Domain.Interfaces;

namespace SalonScheduling.Domain.Validators.UserValidators
{
    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator(IIdentityManager identityUserService)
        {
            RuleFor(r => r.Username)
                .NotEmpty()
                .EmailAddress()
                .MustAsync(async (_, username, _) => await identityUserService.ExistsByUsername(username) is false)
                .WithMessage("Usuário já existe");
        }
    }
}
