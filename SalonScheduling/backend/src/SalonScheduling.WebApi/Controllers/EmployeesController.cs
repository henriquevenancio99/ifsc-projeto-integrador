using Microsoft.AspNetCore.Mvc;
using SalonScheduling.Domain.Commands;
using SalonScheduling.Domain.Dtos.Employee;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.WebApi.Extensions;

namespace SalonScheduling.WebApi.Controllers
{
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        [HttpGet("[controller]")]
        [ProducesResponseType(typeof(EmployeeResponseRequestDto[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromServices] IEmployeeRepository employeeRepository)
        {
            var result = await employeeRepository.GetAllAsNoTracking();

            var response = result
                .Select(employee => new EmployeeResponseRequestDto(
                    employee.Id, employee.Name, employee.Contact, employee.CreatedAt, employee.UpdatedAt
                ))
                .ToArray();

            return Ok(response);
        }

        [HttpGet("[controller]/{id}")]
        [ProducesResponseType(typeof(EmployeeResponseRequestDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(
            [FromServices] IEmployeeRepository employeeRepository, [FromRoute] Guid id)
        {
            var employee = await employeeRepository.GetById(id);

            if (employee is null)
                return NotFound();

            var response = new EmployeeResponseRequestDto(
                employee.Id, employee.Name, employee.Contact, employee.CreatedAt, employee.UpdatedAt
            );

            return Ok(response);
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
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(
            [FromServices] IEmployeeCommandsHandlers handler, 
            [FromRoute] Guid id, 
            [FromBody] UpdateEmployeeRequestBodyDto requestBody)
        {
            return await handler.Handle(new UpdateEmployeeCommand(id, requestBody.Name, requestBody.Contact)) 
                ? NoContent() 
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
