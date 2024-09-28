using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Data;
using SalonScheduling.Data.Identity;
using SalonScheduling.Domain.Interfaces;
using System.Text;

namespace SalonScheduling.WebApi
{
    public static class DependecyInjection
    {
        public static IServiceCollection ConfigureWebApi(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors();
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddRouting(options => options.LowercaseUrls = true);

            services
                .AddIdentity(configuration)
                .AddAuth(configuration)
                .AddSwagger()
                .AddHealthChecks(configuration);

            return services;
        }

        private static IServiceCollection AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new()
                {
                    BearerFormat = "JWT",
                    Description = "JWT authorization header using the bearer scheme.",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Type = SecuritySchemeType.Http
                });

                options.AddSecurityRequirement(new()
                {
                    {
                        new()
                        {
                            Reference = new()
                            {
                                Id = JwtBearerDefaults.AuthenticationScheme,
                                Type = ReferenceType.SecurityScheme
                            }
                        },
                        []
                    }
                });
            });

            return services;
        }

        private static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddHealthChecks()
                .AddNpgSql(
                    connectionString: configuration.GetConnectionString(nameof(SalonSchedulingContext))!,
                    timeout: TimeSpan.FromSeconds(15)
                );

            return services;
        }

        private static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtConfig = configuration.GetSection(nameof(JwtConfig)).Get<JwtConfig>()!;
            services
                .AddAuthentication(options =>
                {
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidAudience = jwtConfig.ValidAudience,
                        ValidIssuer = jwtConfig.ValidIssuer,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.Secret)),
                    };
                });

            services.AddAuthorization();

            return services;
        }

        private static IServiceCollection AddIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddIdentity<User, Role>()
                .AddEntityFrameworkStores<SalonSchedulingContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<IIdentityManager, IdentityManager>();

            return services;
        }
    }
}
