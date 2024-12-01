using FluentValidation.Results;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands.ClientCommands;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Validators.SalonServiceValidators;

namespace SalonScheduling.Domain.Commands.Handlers
{
    public class SalonServiceCommandsHandlers(
        ISalonServiceRepository salonServiceRepository, ISalonServiceTypeRepository salonServiceTypeRepository) :
        ValidatorHelper, ISalonServiceCommandsHandlers
    {
        public async Task<Guid> Handle(CreateSalonServiceCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return default;
            }

            var salonService = SalonService.CreateBy(command);
            await salonServiceRepository.Create(salonService);

            await salonServiceRepository.Commit();

            await PersistSalonServiceTypes(command.ServiceTypes);

            return salonService.Id;
        }

        public async Task<bool> Handle(UpdateSalonServiceCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return false;
            }

            var salonService = SalonService.CreateBy(command);

            isValid = await salonServiceRepository.UpdateAndCommit(command.Id, salonService) > 0;

            if(isValid is false)
            {
                ValidationFailures.Add(new(nameof(command.Id), "Serviço não existe"));
                return false;
            }

            await PersistSalonServiceTypes(command.ServiceTypes);

            return true;
        }

        public virtual async Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(CreateSalonServiceCommand command)
        {
            var result = await new CreateSalonServiceCommandValidator(salonServiceRepository).ValidateAsync(command);

            return (result.IsValid, result.Errors);
        }

        public virtual Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(UpdateSalonServiceCommand command)
        {
            var result = new UpdateSalonServiceCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }

        private async Task PersistSalonServiceTypes(Dictionary<string, string>? salonServiceTypes)
        {
            await salonServiceTypeRepository.Delete(d => d.Key.Length > 0);

            foreach (var serviceType in salonServiceTypes ?? [])
                await salonServiceTypeRepository.Create(new() { Key = serviceType.Key, Name = serviceType.Value });

            await salonServiceTypeRepository.Commit();
        }
    }
}
