using FluentValidation.Results;
using SalonScheduling.CrossCutting.Constants;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Commands.ClientCommands;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;
using SalonScheduling.Domain.Validators.ClientValidators;

namespace SalonScheduling.Domain.Commands.Handlers
{
    public class ClientCommandsHandlers(IClientRepository clientRepository, IUserCommandsHandlers userCommandsHandlers) :
        ValidatorHelper, IClientCommandsHandlers
    {
        public async Task<Guid> Handle(CreateClientCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return default;
            }

            var client = Client.CreateBy(command);
            await clientRepository.Create(client);

            if (await CreateClientUser(command) is false)
                return default;

            await clientRepository.Commit();

            return client.Id;
        }

        public async Task<bool> Handle(UpdateClientCommand command)
        {
            var (isValid, errors) = await Validate(command);

            if (isValid is false)
            {
                ValidationFailures = errors;
                return false;
            }

            var client = Client.CreateBy(command);

            isValid = await clientRepository.UpdateAndCommit(command.Id, client) > 0;

            if(isValid is false)
                ValidationFailures.Add(new(nameof(command.Id), "Cliente não existe"));

            return isValid;
        }

        public virtual async Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(CreateClientCommand command)
        {
            var result = await new CreateClientCommandValidator(clientRepository).ValidateAsync(command);

            return (result.IsValid, result.Errors);
        }

        public virtual Task<(bool IsValid, List<ValidationFailure> Errors)> Validate(UpdateClientCommand command)
        {
            var result = new UpdateClientCommandValidator().Validate(command);

            return Task.FromResult((result.IsValid, result.Errors));
        }

        public virtual async Task<bool> CreateClientUser(CreateClientCommand command) =>
            command.CreateUser is null or false ||
            await userCommandsHandlers.Handle(new(command.Contact!.Email, command.UserPassword, [Roles.Client]));
    }
}
