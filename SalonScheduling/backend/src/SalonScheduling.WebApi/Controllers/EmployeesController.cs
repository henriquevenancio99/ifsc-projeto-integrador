using Microsoft.AspNetCore.Mvc;
using SalonScheduling.Domain.Commands;
using SalonScheduling.Domain.Dtos.Employee;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Queries;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        [HttpGet("[controller]")]
        [ProducesResponseType(typeof(EmployeeQuery[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromServices] IEmployeeQueriesHandlers handler)
        {
            EmployeeQuery[] response = await handler.Handle();

            return Ok(response);
        }

        [HttpGet("[controller]/{id}")]
        [ProducesResponseType(typeof(EmployeeQuery), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromServices] IEmployeeQueriesHandlers handler, [FromRoute] Guid id)
        {
            var response = await handler.Handle(id);

            return response is null ? NotFound() : Ok(response);
        }

        [HttpPost("[controller]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create(
            [FromServices] IEmployeeCommandsHandlers employeeHandlers, [FromBody] CreateEmployeeCommand requestBody)
        {
            var employeeId = await employeeHandlers.Handle(requestBody);

            if (employeeHandlers.HasValidationFailures)
                return this.CustomBadRequest(employeeHandlers.ValidationFailures);

            return Ok(employeeId);
        }

        [HttpPut("[controller]/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(
            [FromServices] IEmployeeCommandsHandlers handler, 
            [FromRoute] Guid id, 
            [FromBody] UpdateEmployeeRequestBodyDto requestBody)
        {
            return await handler.Handle(new UpdateEmployeeCommand(id, requestBody.Name, requestBody.Contact)) 
                ? Ok() 
                : this.CustomBadRequest(handler.ValidationFailures);
        }

        [HttpDelete("[controller]/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(
            [FromServices] IEmployeeRepository employeeRepository, [FromRoute] Guid id)
        {
            await employeeRepository.Delete(d => d.Id == id);

            return NoContent();
        }
    }
}
