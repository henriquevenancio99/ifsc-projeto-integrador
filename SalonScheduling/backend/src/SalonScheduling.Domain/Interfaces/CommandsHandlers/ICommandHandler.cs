using FluentValidation.Results;
using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface ICommandHandler<TCommand, TCommandResponse> where TCommand : BaseCommand
    {
        Task<TCommandResponse> Handle(TCommand command);
        Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(TCommand command);
    }
}
