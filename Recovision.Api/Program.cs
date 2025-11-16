using System.Text;
using Recovision.Core;
using Recovision.Core.Interfaces;
using Recovision.Core.Services;
using Recovision.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// === 1️⃣ Configurare conexiune la baza de date ===
var conn = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CONNECTIONSTRING")??
               builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(conn))
{
    throw new InvalidOperationException("Connection string  not found.");
}

// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(conn), ServiceLifetime.Scoped);
builder.Services.AddDbContext<AppDbContext>(options =>
    options
        .UseNpgsql(conn)
        .EnableSensitiveDataLogging() // Show parameter values
        .EnableDetailedErrors() // Show detailed errors
        .LogTo(Console.WriteLine, LogLevel.Information)
);

// === 2️⃣ Configurare CORS ===
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    );
});

// === 3️⃣ Adăugare servicii custom (logic) ===
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<PacientService>();

var azureBlobConnectionString = builder.Configuration["AzureBlobStorage:ConnectionString"];
var containerName = builder.Configuration["AzureBlobStorage:ContainerName"];
if (string.IsNullOrEmpty(azureBlobConnectionString) || string.IsNullOrEmpty(containerName))
{
    throw new InvalidOperationException("Azure Blob Storage configuration is missing.");
}

builder.Services.AddScoped<IBlobStorageService>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var connStr = azureBlobConnectionString;
    var containerName1 = containerName;
    var db = sp.GetRequiredService<AppDbContext>(); // resolved from DI
    return new BlobStorageService(connStr, containerName1, db);
});

// === 4️⃣ Configurare autentificare JWT ===
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(key))
            throw new InvalidOperationException("JWT key missing from configuration.");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        };
    });

builder.Services.AddAuthorization();

// === 5️⃣ Swagger + OpenAPI ===
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "Recovision API",
            Version = "v1",
            Description =
                "API pentru autentificare, înregistrare și gestionarea pacienților.",
        }
    );

    // Configurare JWT pentru Swagger
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Introdu tokenul JWT: Bearer {token}",
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                Array.Empty<string>()
            },
        }
    );
});

builder.Services.AddControllers();

// Configurare Azure Blob Storage

// === 6️⃣ Construirea aplicației ===
var app = builder.Build();

// === 7️⃣ Pipeline ===
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ✅ Redirect root requests to the frontend (Azure web app)
app.MapGet("/", context =>
{
    
    return context.Response.WriteAsync("API is running.Go to /swagger for tests");
});

app.Run();
