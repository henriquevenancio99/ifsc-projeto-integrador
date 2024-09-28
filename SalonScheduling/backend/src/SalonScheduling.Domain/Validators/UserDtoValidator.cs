using FluentValidation;
using SalonScheduling.Domain.Dtos.User;
using SalonScheduling.Domain.Interfaces;

namespace SalonScheduling.Data.Identity
{
    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator(IIdentityManager identityUserService)
        {
            RuleFor(r => r.Email)
                .NotEmpty()
                .EmailAddress()
                .MustAsync(async (_, username, _) => await identityUserService.ExistsByUsername(username) is false)
                .WithMessage("Usuário já existe");
        }
    }
}
