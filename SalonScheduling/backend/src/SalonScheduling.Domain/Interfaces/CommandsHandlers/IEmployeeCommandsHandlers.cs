using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface IEmployeeCommandsHandlers : 
        IValidatorHelper,
        ICommandHandler<CreateEmployeeCommand, Guid>,
        ICommandHandler<UpdateEmployeeCommand, bool>,
        ICommandHandler<CreateEmplyeeUserCommand, bool>
    {
    }
}
