using GymManagement.DbHelper;
using GymManagement.API.Trainer.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddSingleton<IDbHelper>(new SqlServerHelper(connectionString!));

// Đăng ký các Service
builder.Services.AddScoped<ITrainerService, TrainerService>();
builder.Services.AddScoped<IBuoiTapPTService, BuoiTapPTService>();
builder.Services.AddScoped<IHopDongPTService, HopDongPTService>();
builder.Services.AddScoped<IGoiPTService, GoiPTService>();
builder.Services.AddScoped<IThongBaoService, ThongBaoService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
