using GymManagement.DbHelper;
using GymManagement.API.Admin.Services;
using GymManagement.API.Admin.Data;

var builder = WebApplication.CreateBuilder(args);

// CORS cho Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "GymManagement Admin API", Version = "v1" });
});

// DbHelper
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddSingleton<IDbHelper>(new SqlServerHelper(connectionString!));

// Data (Repositories)
builder.Services.AddScoped<IChucVuRepository, ChucVuRepository>();
builder.Services.AddScoped<IThanhVienRepository, ThanhVienRepository>();
builder.Services.AddScoped<IGoiTapRepository, GoiTapRepository>();
builder.Services.AddScoped<INhanVienRepository, NhanVienRepository>();
builder.Services.AddScoped<IDangKyGoiTapRepository, DangKyGoiTapRepository>();
builder.Services.AddScoped<IGoiPTRepository, GoiPTRepository>();
builder.Services.AddScoped<IHoaDonRepository, HoaDonRepository>();
builder.Services.AddScoped<IThanhToanRepository, ThanhToanRepository>();
builder.Services.AddScoped<IDiemDanhRepository, DiemDanhRepository>();

// Services
builder.Services.AddScoped<IChucVuService, ChucVuService>();
builder.Services.AddScoped<IThanhVienService, ThanhVienService>();
builder.Services.AddScoped<IGoiTapService, GoiTapService>();
builder.Services.AddScoped<INhanVienService, NhanVienService>();
builder.Services.AddScoped<IDangKyGoiTapService, DangKyGoiTapService>();
builder.Services.AddScoped<IGoiPTService, GoiPTService>();
builder.Services.AddScoped<IHoaDonService, HoaDonService>();
builder.Services.AddScoped<IThanhToanService, ThanhToanService>();
builder.Services.AddScoped<IDiemDanhService, DiemDanhService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();
app.Run();
