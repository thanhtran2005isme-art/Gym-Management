using GymManagement.API.Admin.Services;

var builder = WebApplication.CreateBuilder(args);

// Connection String cho ADO.NET
var connectionString = builder.Configuration.GetConnectionString("GymDB");
builder.Services.AddSingleton(connectionString!);

// Services
builder.Services.AddScoped<IChucVuService, ChucVuService>();
builder.Services.AddScoped<INhanVienService, NhanVienService>();
builder.Services.AddScoped<IGoiTapService, GoiTapService>();
builder.Services.AddScoped<IThanhVienService, ThanhVienService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
