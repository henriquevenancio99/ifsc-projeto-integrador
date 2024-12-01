using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonScheduling.CrossCutting.Constants;
using SalonScheduling.Domain.Commands.ClientCommands;
using SalonScheduling.Domain.Dtos.SalonService;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Queries;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    public class SalonServicesController : ControllerBase
    {
        [HttpGet("[controller]")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
        [ProducesResponseType(typeof(SalonServiceQuery[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromServices] ISalonServiceQueriesHandlers handler) =>
            Ok(await handler.Handle());

        [HttpGet("[controller]/{id}")]
        [Authorize(Roles = Roles.All)]
        [ProducesResponseType(typeof(SalonServiceQuery), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromServices] ISalonServiceQueriesHandlers handler, [FromRoute] Guid id)
        {
            var response = await handler.Handle(id);

            return response is null ? NotFound() : Ok(response);
        }

        [HttpPost("[controller]")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create(
            [FromServices] ISalonServiceCommandsHandlers salonServiceHandlers, 
            [FromBody] CreateSalonServiceCommand requestBody)
        {
            var SalonServiceId = await salonServiceHandlers.Handle(requestBody);

            if (salonServiceHandlers.HasValidationFailures)
                return this.CustomBadRequest(salonServiceHandlers.ValidationFailures);

            return Ok(SalonServiceId);
        }

        [HttpPut("[controller]/{id}")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(
            [FromServices] ISalonServiceCommandsHandlers handler,
            [FromRoute] Guid id,
            [FromBody] UpdateSalonServiceRequestBodyDto requestBody)
        {
            var command = new UpdateSalonServiceCommand(
                id, 
                requestBody.Name, 
                requestBody.Price, 
                requestBody.ServiceTypes, 
                requestBody.SelectedSalonServiceTypes, 
                requestBody.ServiceTime, 
                requestBody.Description
            );

            return await handler.Handle(command) ? Ok() : this.CustomBadRequest(handler.ValidationFailures);
        }

        [HttpDelete("[controller]/{id}")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(
            [FromServices] ISalonServiceRepository SalonServiceRepository, [FromRoute] Guid id)
        {
            await SalonServiceRepository.Delete(d => d.Id == id);

            return NoContent();
        }

        [HttpGet("[controller]/types")]
        [Authorize(Roles = Roles.All)]
        [ProducesResponseType(typeof(Dictionary<string, string>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllServiceTypes([FromServices] ISalonServiceTypeQueriesHandlers handler) => 
            Ok(await handler.Handle());
    }
}
