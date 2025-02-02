using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands.SchedulingCommands;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface ISchedulingCommandsHandlers : 
        IValidatorHelper,
        ICommandHandler<CreateSchedulingCommand, Guid>,
        ICommandHandler<UpdateSchedulingCommand, bool>
    {
    }
}
