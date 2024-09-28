using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Data.Identity;
using SalonScheduling.Domain.Dtos.Role;
using System.Data;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    [Authorize(Roles = JwtHelper.AdminRoleName)]
    public class RolesController(RoleManager<Role> roleManager) : ControllerBase
    {
        [HttpGet("[controller]")]
        [ProducesResponseType(typeof(RoleRequestResponseDto[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll()
        {
            var roles = await roleManager.Roles
                .Select(s => new RoleRequestResponseDto(s.Id, s.Name!))
                .ToListAsync();

            return Ok(roles ?? []);
        }

        [HttpPost("[controller]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateRole([FromBody] RoleDto requestBody)
        {
            foreach (var role in requestBody.Roles.Select(s => s.Trim()))
            {
                if (await roleManager.RoleExistsAsync(role))
                    continue;

                await roleManager.CreateAsync(new Role(role));
            }

            return Ok();
        }

        [HttpDelete("[controller]/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var role = await roleManager.FindByIdAsync(id);

            if (role is null)
                return NotFound();

            await roleManager.DeleteAsync(role);

            return NoContent();
        }
    }
}
