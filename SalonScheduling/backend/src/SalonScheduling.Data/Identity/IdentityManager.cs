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
using SalonScheduling.Domain.Validators.UserValidators;
using System.Data;

namespace SalonScheduling.Data.Identity
{
    public class IdentityManager(
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        IUserRefreshTokenRepository userRefreshTokenRepository,
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

        public async Task<TokenRequestResponseDto?> Login(LoginDto login)
        {
            var identityUser = await userManager.FindByNameAsync(login.Username);

            if (identityUser is null)
            {
                ValidationFailures.Add(new(nameof(login.Username), "Usuário não existe"));
                return default;
            }

            if (await userManager.CheckPasswordAsync(identityUser, login.Password) is false)
                return default;

            var (token, refreshToken) = await GetTokens(identityUser);

            await userRefreshTokenRepository.RecreateRefreshToken(identityUser, refreshToken);

            await userManager.UpdateAsync(identityUser);

            return new(identityUser.UserName!, token, refreshToken);
        }

        public async Task<TokenRequestResponseDto?> RefreshToken(RefreshTokenRequestBodyDto requestBody)
        {
            var identityUser = await userManager.FindByNameAsync(requestBody.Username);

            if (identityUser is null)
            {
                ValidationFailures.Add(new(nameof(requestBody.Username), "Usuário não existe"));
                return default;
            }

            var userRefreshToken = await userRefreshTokenRepository.GetByUserId(identityUser.Id);
            if (userRefreshToken is null)
            {
                ValidationFailures.Add(new(nameof(requestBody.Username), "Usuário não possui Refresh Token"));
                return default;
            }

            if (userRefreshToken.Validate(requestBody.RefreshToken))
            {
                ValidationFailures.Add(new(nameof(requestBody), "Refresh Token inválido"));
                return default;
            }

            var (token, newRefreshToken) = await GetTokens(identityUser);

            userRefreshToken.RefreshToken = newRefreshToken;
            userRefreshToken.Expiration = DateTimeOffset.UtcNow.AddHours(1);

            await userManager.UpdateAsync(identityUser);

            return new(identityUser.UserName!, token, newRefreshToken);
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
                UserName = user.Username,
                Email = user.Username,
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

            foreach (var role in Roles.GetAll())
                if (await roleManager.RoleExistsAsync(role) is false)
                    await roleManager.CreateAsync(new Role(role));

            var roles = await roleManager.Roles
                .Select(s => s.Name!)
                .ToListAsync();

            await userManager.AddToRolesAsync(identityUser, roles);

            return new(identityUser.UserName, password, Roles.GetAll());
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

        public async Task Update(Guid id, EditUserDto requestBody)
        {
            var identityUser = await userManager.FindByIdAsync(id.ToString());

            if (identityUser is null)
            {
                ValidationFailures.Add(new(nameof(requestBody.Username), "Usuário não existe"));
                return;
            }

            var validatorResult = new EditUserDtoValidator().Validate(requestBody);

            if (validatorResult.IsValid is false)
            {
                ValidationFailures = validatorResult.Errors;
                return;
            }

            identityUser.UserName = requestBody.Username;
            await OverrideRoles(identityUser, requestBody.Roles);

            var result = await userManager.UpdateAsync(identityUser);

            if(result.Succeeded is false)
            {
                ValidationFailures = result.Errors
                    .Select(s => new ValidationFailure(nameof(identityUser), s.Description))
                    .ToList();
            }
        }

        private async Task AssignRolesIfExists(User identityUser, string[] roles)
        {
            foreach (var role in roles)
                if (await roleManager.RoleExistsAsync(role))
                    await userManager.AddToRoleAsync(identityUser, role);
        }

        private async Task OverrideRoles(User identityUser, string[] roles)
        {
            var currentRoles = await userManager.GetRolesAsync(identityUser);

            if (currentRoles is not null && currentRoles.Count > 0)
                await userManager.RemoveFromRolesAsync(identityUser, currentRoles);

            await AssignRolesIfExists(identityUser, roles);
        }

        private async Task<string> GetMessageToResetPassword(User identityUser, ForgetPasswordRequestBodyDto requestBody)
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(identityUser);

            if (string.IsNullOrEmpty(requestBody.ClientUriToResetPassword))
                return $"Informe o token a seguir para alterar a senha: {token}";

            var encodedToken = Uri.EscapeDataString(token);

            var resetPasswordUrl = requestBody.ClientUriToResetPassword + $"?token={encodedToken}&email={requestBody.Email}";

            return $"Clique no link a seguir para alterar a senha: {resetPasswordUrl}";
        }

        private async Task<(string Token, string RefreshToken)> GetTokens(User identityUser)
        {
            var userRoles = await userManager.GetRolesAsync(identityUser);
            var jwtConfig = configuration.GetJwtConfig();

            return JwtHelper.GenerateToken(jwtConfig, identityUser.UserName!, userRoles);
        }
    }
}
