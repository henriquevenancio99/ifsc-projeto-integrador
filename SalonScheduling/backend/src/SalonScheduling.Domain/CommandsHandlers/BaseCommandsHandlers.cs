using FluentValidation.Results;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;

namespace SalonScheduling.Domain.CommandsHandlers
{
    public abstract class BaseCommandsHandlers : IBaseCommandsHandlers
    {
        public bool HasValidationFailures => 
            ValidationFailures.Count > 0;

        public List<ValidationFailure> ValidationFailures { get; set; } = [];
    }
}
