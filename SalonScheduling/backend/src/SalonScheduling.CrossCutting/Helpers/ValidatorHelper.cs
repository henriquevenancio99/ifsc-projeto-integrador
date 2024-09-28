using FluentValidation.Results;

namespace SalonScheduling.CrossCutting.Helpers
{
    public interface IValidatorHelper
    {
        bool HasValidationFailures { get; }
        List<ValidationFailure> ValidationFailures { get; set; }
    }

    public abstract class ValidatorHelper : IValidatorHelper
    {
        public bool HasValidationFailures =>
            ValidationFailures.Count > 0;

        public List<ValidationFailure> ValidationFailures { get; set; } = [];
    }
}
