using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands.ClientCommands;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface IClientCommandsHandlers : 
        IValidatorHelper,
        ICommandHandler<CreateClientCommand, Guid>,
        ICommandHandler<UpdateClientCommand, bool>
    {
    }
}
