using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SalonScheduling.CrossCutting.Constants;
using SalonScheduling.CrossCutting.Extensions;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Dtos.Role;
using SalonScheduling.Domain.Dtos.User;
using SalonScheduling.Domain.Interfaces;
using SalonScheduling.Domain.Validators;

namespace SalonScheduling.Data.Identity
{
    public class IdentityManager(
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        IConfiguration configuration) : ValidatorHelper, IIdentityManager
    {
        public async Task<UserRequestResponseDto[]> GetAllUsersWithRolesAsNoTracking()
        {
            var usersWithRoles = await userManager.Users
                .AsNoTracking()
                .Include(i => i.UserRoles)
                    .ThenInclude(t => t.Role)
                .ToArrayAsync();

            return usersWithRoles
                ?.Select(s => new UserRequestResponseDto(
                    s.Id, 
                    s.UserName!, 
                    s.UserRoles?.Select(s => s.Role.Name!).ToArray() ?? []
                ))
                .ToArray() ?? [];
        }

        public async Task<string?> Login(LoginDto login)
        {
            var identityUser = await userManager.FindByNameAsync(login.Username);

            if (identityUser is null)
            {
                ValidationFailures.Add(new(nameof(login.Username), "Usuário não existe"));
                return default;
            }

            if (await userManager.CheckPasswordAsync(identityUser, login.Password) is false)
                return default;

            var userRoles = await userManager.GetRolesAsync(identityUser);
            var jwtConfig = configuration.GetJwtConfig();

            return JwtHelper.GenerateToken(jwtConfig, login.Username, userRoles);
        }

        public async Task<Guid> CreateUser(UserDto user)
        {
            var validatorResult = await new UserDtoValidator(this).ValidateAsync(user);

            if (validatorResult.IsValid is false)
            {
                ValidationFailures = validatorResult.Errors;
                return default;
            }

            var identityUser = new User
            {
                Id = Guid.NewGuid(),
                UserName = user.Email,
                Email = user.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(identityUser, user.Password);

            if (result.Succeeded is false)
            {
                ValidationFailures = result.Errors
                    .Select(s => new ValidationFailure(nameof(user.Password), s.Description))
                    .ToList();

                return default;
            }

            await AssignRolesIfExists(identityUser, user.Roles);

            return identityUser.Id;
        }

        public async Task<UserDto?> CreateAdminUser()
        {
            if (await userManager.FindByNameAsync(Roles.Admin) is not null)
            {
                ValidationFailures.Add(new("Username", "Usuário administrador já existe"));
                return default;
            }

            var identityUser = new User
            {
                UserName = Roles.Admin,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var password = $"admin!{userManager.GenerateNewAuthenticatorKey()}";
            var result = await userManager.CreateAsync(identityUser, password);

            if (result.Succeeded is false)
                return default;

            if (await roleManager.RoleExistsAsync(Roles.Admin) is false)
                await roleManager.CreateAsync(new Role(Roles.Admin));

            var roles = await roleManager.Roles
                .Select(s => s.Name!)
                .ToListAsync();

            await userManager.AddToRolesAsync(identityUser, roles);

            return new(identityUser.UserName, password, [.. roles]);
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            var identityUser = await userManager.FindByIdAsync(id.ToString());

            if (identityUser is null)
                return false;

            await userManager.DeleteAsync(identityUser);

            return true;
        }

        public async Task<bool> AssignRoles(Guid id, RoleDto role)
        {
            var identityUser = await userManager.FindByIdAsync(id.ToString());

            if (identityUser is null)
                return false;

            await AssignRolesIfExists(identityUser, role.Roles);

            return true;
        }

        private async Task AssignRolesIfExists(User identityUser, string[] roles)
        {
            foreach (var role in roles)
                if (await roleManager.RoleExistsAsync(role))
                    await userManager.AddToRoleAsync(identityUser, role);
        }

        public async Task<bool> ExistsByUsername(string username) => 
            await userManager.FindByNameAsync(username) is not null;

        public async Task<bool> ForgetPassword(ForgetPasswordRequestBodyDto requestBody)
        {
            var identityUser = await userManager.FindByNameAsync(requestBody.Email);

            if (identityUser is null)
                return false;

            var message = await GetMessageToResetPassword(identityUser, requestBody);

            await EmailHelper.SendEmail(
                configuration.GetEmailCredentials(),
                toEmail: requestBody.Email,
                subject: "Alterar a senha",
                message
            );

            return true;
        }

        public async Task<bool> ResetPassword(ResetPasswordRequestBodyDto requestBody)
        {
            var validatorResult = new ResetPasswordRequestBodyDtoValidator().Validate(requestBody);

            if(validatorResult.IsValid is false)
            {
                ValidationFailures = validatorResult.Errors;
                return false;
            }

            var user = await userManager.FindByNameAsync(requestBody.Email!);

            if (user is null)
                return false;

            var resetPasswordResult = await userManager.ResetPasswordAsync(user, requestBody.Token!, requestBody.NewPassword!);

            if (resetPasswordResult.Succeeded is false)
            {
                ValidationFailures = resetPasswordResult.Errors
                    .Select(s => new ValidationFailure(nameof(requestBody.NewPassword), s.Description))
                    .ToList();

                return false;
            }

            return true;
        }

        private async Task<string> GetMessageToResetPassword(User identityUser, ForgetPasswordRequestBodyDto requestBody)
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(identityUser);

            if (string.IsNullOrEmpty(requestBody.ClientUriToResetPassword))
                return $"Informe o token a seguir para alterar a senha: {token}";

            var resetPasswordUrl = requestBody.ClientUriToResetPassword + $"?token={token}&email={requestBody.Email}";

            return $"Clique no link a seguir para alterar a senha: {resetPasswordUrl}";
        }
    }
}
