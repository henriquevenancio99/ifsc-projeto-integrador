using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonScheduling.CrossCutting.Constants;
using SalonScheduling.Data.Identity;
using SalonScheduling.Domain.Dtos.Role;
using System.Data;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    public class RolesController(RoleManager<Role> roleManager) : ControllerBase
    {
        [HttpGet("[controller]")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
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
        [Authorize(Roles = Roles.Admin)]
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
        [Authorize(Roles = Roles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var role = await roleManager.FindByIdAsync(id);

            if (role is null)
                return NotFound();

            await roleManager.DeleteAsync(role);

            return Ok();
        }
    }
}
