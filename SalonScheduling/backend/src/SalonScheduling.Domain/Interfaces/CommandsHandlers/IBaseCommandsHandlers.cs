using FluentValidation.Results;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface IBaseCommandsHandlers
    {
        bool HasValidationFailures { get; }
        List<ValidationFailure> ValidationFailures { get; set; }
    }
}
