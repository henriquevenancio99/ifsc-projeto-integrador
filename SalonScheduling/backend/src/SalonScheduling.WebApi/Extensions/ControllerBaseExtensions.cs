using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace SalonScheduling.WebApi.Extensions
{
    public static class ControllerBaseExtensions
    {
        public static IActionResult CustomBadRequest(this ControllerBase controllerBase, List<ValidationFailure> errors) =>
            controllerBase.ValidationProblem(
                new ValidationProblemDetails(
                    errors
                        .GroupBy(g => g.PropertyName)
                        .ToDictionary(
                            key => key.Key, 
                            value => value.Select(s => s.ErrorMessage).ToArray()
                        )
                )
            );
    }
}
