using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonScheduling.CrossCutting.Constants;
using SalonScheduling.Domain.Commands.SchedulingCommands;
using SalonScheduling.Domain.Dtos.Scheduling;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Queries;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    public class SchedulingsController : ControllerBase
    {
        [HttpGet("[controller]")]
        [Authorize(Roles = Roles.Employee)]
        [ProducesResponseType(typeof(SchedulingQuery[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromServices] ISchedulingQueriesHandlers handler) =>
            Ok(await handler.Handle());

        [HttpGet("[controller]/{id}")]
        [Authorize(Roles = Roles.Employee)]
        [ProducesResponseType(typeof(SchedulingQuery), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromServices] ISchedulingQueriesHandlers handler, [FromRoute] Guid id)
        {
            var response = await handler.Handle(id);

            return response is null ? NotFound() : Ok(response);
        }

        [HttpPost("[controller]")]
        [Authorize(Roles = Roles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create(
            [FromServices] ISchedulingCommandsHandlers handlers, [FromBody] CreateSchedulingCommand requestBody)
        {
            var employeeId = await handlers.Handle(requestBody);

            if (handlers.HasValidationFailures)
                return this.CustomBadRequest(handlers.ValidationFailures);

            return Ok(employeeId);
        }

        [HttpPut("[controller]/{id}")]
        [Authorize(Roles = Roles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(
            [FromServices] ISchedulingCommandsHandlers handler, 
            [FromRoute] Guid id, 
            [FromBody] UpdateSchedulingRequestBodyDto requestBody)
        {
            var command = new UpdateSchedulingCommand(
                id, 
                requestBody.ClientId, 
                requestBody.EmployeesIds, 
                requestBody.SalonServicesIds, 
                requestBody.Start, 
                requestBody.End
            );

            return await handler.Handle(command) 
                ? Ok() 
                : this.CustomBadRequest(handler.ValidationFailures);
        }

        [HttpDelete("[controller]/{id}")]
        [Authorize(Roles = Roles.Admin)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(
            [FromServices] ISchedulingRepository employeeRepository, [FromRoute] Guid id)
        {
            await employeeRepository.Delete(d => d.Id == id);

            return NoContent();
        }
    }
}
