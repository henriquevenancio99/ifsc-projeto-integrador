using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonScheduling.CrossCutting.Constants;
using SalonScheduling.Domain.Dtos.Role;
using SalonScheduling.Domain.Dtos.User;
using SalonScheduling.Domain.Interfaces;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class UsersController(IIdentityManager identityManager) : ControllerBase
    {
        [HttpGet("[controller]")]
        [ProducesResponseType(typeof(UserRequestResponseDto[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll() =>
            Ok(await identityManager.GetAllUsersWithRolesAsNoTracking());

        [HttpPost("[controller]:login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Login([FromBody] LoginDto requestBody)
        {
            var token = await identityManager.Login(requestBody);

            if(identityManager.HasValidationFailures)
                return this.CustomBadRequest(identityManager.ValidationFailures);

            return token is null ? Unauthorized() : Ok(new { token });
        }

        [HttpPost("[controller]:register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] UserDto requestBody)
        {
            var id = await identityManager.CreateUser(requestBody);

            if (identityManager.HasValidationFailures)
                return this.CustomBadRequest(identityManager.ValidationFailures);

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
            var user = await identityManager.CreateAdminUser();

            if(identityManager.HasValidationFailures)
                return this.CustomBadRequest(identityManager.ValidationFailures);

            return Ok(user);
        }

        [HttpDelete("[controller]/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete([FromRoute] Guid id) =>
            await identityManager.DeleteUser(id) ? Ok() : NotFound();

        [HttpPost("[controller]/{id}/roles:assign")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> AssignRole([FromRoute] Guid id, [FromBody] RoleDto requestBody) =>
            await identityManager.AssignRoles(id, requestBody) ? Ok() : NotFound();

        [HttpPost("[controller]:forget-password")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordRequestBodyDto requestBody) =>
            await identityManager.ForgetPassword(requestBody) ? Ok() : NotFound();

        [HttpPost("[controller]:reset-password")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestBodyDto requestBody)
        {
            await identityManager.ResetPassword(requestBody);

            if (identityManager.HasValidationFailures)
                return this.CustomBadRequest(identityManager.ValidationFailures);

            return Ok();
        }
    }
}
