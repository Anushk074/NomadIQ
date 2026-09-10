using System.Text;
using AIService.Application.Abstractions;
using AIService.Application.Services;
using AIService.Infrastructure.Ai;
using AIService.Infrastructure.Clients;
using AIService.Infrastructure.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));
builder.Services.Configure<GeminiSettings>(builder.Configuration.GetSection(GeminiSettings.SectionName));

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
    ?? throw new InvalidOperationException("The 'Jwt' configuration section is missing.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddHttpClient<IDiscoveryServiceClient, DiscoveryServiceClient>(client =>
{
    var baseUrl = builder.Configuration["Services:DiscoveryService:BaseUrl"];

    if (string.IsNullOrWhiteSpace(baseUrl))
    {
        throw new InvalidOperationException("The 'Services:DiscoveryService:BaseUrl' configuration value is missing.");
    }

    client.BaseAddress = new Uri(baseUrl);
});

builder.Services.AddHttpClient<IAIProvider, GeminiAIProvider>((sp, client) =>
{
    var geminiSettings = sp.GetRequiredService<IOptions<GeminiSettings>>().Value;
    client.BaseAddress = new Uri(geminiSettings.BaseUrl);
});

builder.Services.AddScoped<ITripPlannerService, TripPlannerService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
