using SalonScheduling.Data;
using SalonScheduling.Domain;
using SalonScheduling.WebApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .ConfigureWebApi(builder.Configuration)
    .ConfigureData(builder.Configuration)
    .ConfigureDomain();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(config => 
{
    config.SetIsOriginAllowed(_ => true);
    config.AllowAnyOrigin();
    config.AllowAnyMethod();
    config.AllowAnyHeader();
});
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI(u => u.SwaggerEndpoint("../swagger/v1/swagger.json", $"API v1"));
app.UseHealthChecks("/health");

app.MapControllers().RequireAuthorization();

app.Run();
