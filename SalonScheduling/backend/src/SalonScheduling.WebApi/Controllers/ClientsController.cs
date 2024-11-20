using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonScheduling.CrossCutting.Constants;
using SalonScheduling.Domain.Commands.ClientCommands;
using SalonScheduling.Domain.Dtos.Client;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Queries;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    public class ClientsController : ControllerBase
    {
        [HttpGet("[controller]")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
        [ProducesResponseType(typeof(ClientQuery[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromServices] IClientQueriesHandlers handler) =>
            Ok(await handler.Handle());

        [HttpGet("[controller]/{id}")]
        [Authorize(Roles = Roles.All)]
        [ProducesResponseType(typeof(ClientQuery), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromServices] IClientQueriesHandlers handler, [FromRoute] Guid id)
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
            [FromServices] IClientCommandsHandlers clientHandlers, [FromBody] CreateClientCommand requestBody)
        {
            var clientId = await clientHandlers.Handle(requestBody);

            if (clientHandlers.HasValidationFailures)
                return this.CustomBadRequest(clientHandlers.ValidationFailures);

            return Ok(clientId);
        }

        [HttpPut("[controller]/{id}")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(
            [FromServices] IClientCommandsHandlers handler, 
            [FromRoute] Guid id, 
            [FromBody] UpdateClientRequestBodyDto requestBody)
        {
            return await handler.Handle(new UpdateClientCommand(id, requestBody.Name, requestBody.Contact)) 
                ? Ok() 
                : this.CustomBadRequest(handler.ValidationFailures);
        }

        [HttpDelete("[controller]/{id}")]
        [Authorize(Roles = Roles.AdminAndEmployee)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(
            [FromServices] IClientRepository clientRepository, [FromRoute] Guid id)
        {
            await clientRepository.Delete(d => d.Id == id);

            return NoContent();
        }
    }
}
