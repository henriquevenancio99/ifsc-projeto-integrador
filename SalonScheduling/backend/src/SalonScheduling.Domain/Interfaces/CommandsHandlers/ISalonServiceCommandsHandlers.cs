using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands.ClientCommands;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface ISalonServiceCommandsHandlers : 
        IValidatorHelper,
        ICommandHandler<CreateSalonServiceCommand, Guid>,
        ICommandHandler<UpdateSalonServiceCommand, bool>
    {
    }
}
