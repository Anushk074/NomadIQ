using System.Text;
using AIService.Application.Abstractions;
using AIService.Application.Services;
using AIService.Infrastructure.Ai;
using AIService.Infrastructure.Clients;
using AIService.Infrastructure.Configuration;
using AIService.Infrastructure.Http;
using AIService.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
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

// Allows the React frontend (a different origin) to call this API from the browser.
// Allowed origins are configuration-driven (see appsettings.Development.json) so
// production origins can be set per environment without a code change.
const string FrontendCorsPolicy = "Frontend";

var corsSettings = builder.Configuration.GetSection(CorsSettings.SectionName).Get<CorsSettings>() ?? new CorsSettings();

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins(corsSettings.AllowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

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

builder.Services.AddDbContext<AiDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("AiDatabase")));

builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<BearerTokenForwardingHandler>();

builder.Services.AddHttpClient<IDiscoveryServiceClient, DiscoveryServiceClient>(client =>
{
    var baseUrl = builder.Configuration["Services:DiscoveryService:BaseUrl"];

    if (string.IsNullOrWhiteSpace(baseUrl))
    {
        throw new InvalidOperationException("The 'Services:DiscoveryService:BaseUrl' configuration value is missing.");
    }

    client.BaseAddress = new Uri(baseUrl);
});

builder.Services.AddHttpClient<ITripServiceClient, TripServiceClient>(client =>
{
    var baseUrl = builder.Configuration["Services:TripService:BaseUrl"];

    if (string.IsNullOrWhiteSpace(baseUrl))
    {
        throw new InvalidOperationException("The 'Services:TripService:BaseUrl' configuration value is missing.");
    }

    client.BaseAddress = new Uri(baseUrl);
}).AddHttpMessageHandler<BearerTokenForwardingHandler>();

builder.Services.AddHttpClient<IAIProvider, GeminiAIProvider>((sp, client) =>
{
    var geminiSettings = sp.GetRequiredService<IOptions<GeminiSettings>>().Value;
    client.BaseAddress = new Uri(geminiSettings.BaseUrl);
});

builder.Services.AddScoped<ITripPlannerService, TripPlannerService>();
builder.Services.AddScoped<IConversationService, ConversationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
