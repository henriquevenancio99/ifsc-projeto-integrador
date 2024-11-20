using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface IUserCommandsHandlers : 
        IValidatorHelper,
        ICommandHandler<CreateUserCommand, bool>
    {
    }
}
