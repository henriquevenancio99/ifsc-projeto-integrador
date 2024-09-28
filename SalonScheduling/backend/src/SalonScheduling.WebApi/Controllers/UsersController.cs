using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Dtos.Role;
using SalonScheduling.Domain.Dtos.User;
using SalonScheduling.Domain.Interfaces;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    [Authorize(Roles = JwtHelper.AdminRoleName)]
    public class UsersController(IIdentityManager identityUserService) : ControllerBase
    {
        [HttpGet("[controller]")]
        [ProducesResponseType(typeof(UserRequestResponseDto[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll() =>
            Ok(await identityUserService.GetAllUsersWithRolesAsNoTracking());

        [HttpPost("[controller]:login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Login([FromBody] LoginDto requestBody)
        {
            var token = await identityUserService.Login(requestBody);

            if(identityUserService.HasValidationFailures)
                return this.CustomBadRequest(identityUserService.ValidationFailures);

            return token is null ? Unauthorized() : Ok(token);
        }

        [HttpPost("[controller]:register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] UserDto requestBody)
        {
            var id = await identityUserService.CreateUser(requestBody);

            if (identityUserService.HasValidationFailures)
                return this.CustomBadRequest(identityUserService.ValidationFailures);

            return Ok(new { id });
        }

        [HttpPost("[controller]:register-admin")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateAdminUser()
        {
            var user = await identityUserService.CreateAdminUser();

            if(identityUserService.HasValidationFailures)
                return this.CustomBadRequest(identityUserService.ValidationFailures);

            return Ok(user);
        }

        [HttpDelete("[controller]/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete([FromRoute] Guid id) =>
            await identityUserService.DeleteUser(id) ? NoContent() : NotFound();

        [HttpPost("[controller]/{id}/roles:assign")]
        public async Task<IActionResult> AssignRole([FromRoute] Guid id, [FromBody] RoleDto requestBody) =>
            await identityUserService.AssignRoles(id, requestBody) ? NoContent() : NotFound();
    }
}
