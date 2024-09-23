using SalonScheduling.Domain.Commands;

namespace SalonScheduling.Domain.Interfaces.CommandsHandlers
{
    public interface IEmployeeCommandsHandlers : 
        IBaseCommandsHandlers,
        ICommandHandler<CreateEmployeeCommand, Guid>,
        ICommandHandler<UpdateEmployeeCommand, bool>
    {
    }
}
