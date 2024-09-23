using Microsoft.AspNetCore.Mvc;
using SalonScheduling.Domain.Commands;
using SalonScheduling.Domain.Dtos;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(typeof(Employee[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get([FromServices] IEmployeeRepository employeeRepository) =>
            Ok(await employeeRepository.GetAllAsNoTracking());

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Employee), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromServices] IEmployeeRepository employeeRepository, [FromRoute] Guid id)
        {
            var employee = await employeeRepository.GetById(id);

            return employee is null ? NotFound() : Ok(employee);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromServices] IEmployeeCommandsHandlers handler, [FromBody] CreateEmployeeCommand command)
        {
            var employeeId = await handler.Handle(command);

            if (handler.HasValidationFailures)
                return this.CustomBadRequest(handler.ValidationFailures);

            return Ok(employeeId);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(
            [FromServices] IEmployeeCommandsHandlers handler, [FromRoute] Guid id, [FromBody] UpdateEmployeeRequestBodyDto requestBody)
        {
            return await handler.Handle(new UpdateEmployeeCommand(id, requestBody.Name, requestBody.Contact)) 
                ? NoContent() 
                : this.CustomBadRequest(handler.ValidationFailures);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete([FromServices] IEmployeeRepository employeeRepository, [FromRoute] Guid id)
        {
            await employeeRepository.Delete(d => d.Id == id);

            return NoContent();
        }
    }
}
