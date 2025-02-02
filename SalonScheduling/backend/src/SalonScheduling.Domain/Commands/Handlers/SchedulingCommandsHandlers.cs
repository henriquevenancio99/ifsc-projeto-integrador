using FluentValidation.Results;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands.SchedulingCommands;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Validators.SchedulingValidator;

namespace SalonScheduling.Domain.Commands.Handlers
{
    public class SchedulingCommandsHandlers(
        ISchedulingRepository schedulingRepository,
        IClientRepository clientRepository,
        IEmployeeRepository employeeRepository,
        ISalonServiceRepository salonServiceRepository)
        : ValidatorHelper, ISchedulingCommandsHandlers
    {
        public async Task<Guid> Handle(CreateSchedulingCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return default;
            }

            var employees = await employeeRepository.GetByFilters(g => command.EmployeesIds.Contains(g.Id));
            var salonServices = await salonServiceRepository.GetByFilters(g => command.SalonServicesIds.Contains(g.Id));
            var client = await clientRepository.GetById(command.ClientId);

            var scheduling = Scheduling.CreateBy(command, client!, employees!, salonServices!);

            await schedulingRepository.Create(scheduling);
            await schedulingRepository.Commit();

            return scheduling.Id;
        }

        public async Task<bool> Handle(UpdateSchedulingCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return false;
            }

            var scheduling = await schedulingRepository.GetByIdWithIncludes(command.Id);

            if (scheduling is null)
            {
                ValidationFailures.Add(new(nameof(command.Id), "Agendamento não existe"));
                return false;
            }

            var employees = await employeeRepository.GetByFilters(g => command.EmployeesIds.Contains(g.Id));
            var salonServices = await salonServiceRepository.GetByFilters(g => command.SalonServicesIds.Contains(g.Id));
            var client = await clientRepository.GetById(command.ClientId);

            scheduling.UpdateProperties(command, client!, employees!, salonServices!);

            await schedulingRepository.Update(scheduling);
            await schedulingRepository.Commit();

            return true;
        }

        public virtual Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(CreateSchedulingCommand command)
        {
            var result = new CreateSchedulingCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }

        public virtual Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(UpdateSchedulingCommand command)
        {
            var result = new UpdateSchedulingCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }
    }
}
