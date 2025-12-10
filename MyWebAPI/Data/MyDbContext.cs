using Microsoft.EntityFrameworkCore;
using MyWebAPI.Models.Entities;

namespace MyWebAPI.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        #region DbSet
        public DbSet<ThanhVien> ThanhViens { get; set; }
        public DbSet<NhanVien> NhanViens { get; set; }
        public DbSet<ChucVu> ChucVus { get; set; }
        public DbSet<VaiTro> VaiTros { get; set; }
        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<GoiTap> GoiTaps { get; set; }
        public DbSet<GoiPT> GoiPTs { get; set; }
        public DbSet<HuanLuyenVien> HuanLuyenViens { get; set; }
        public DbSet<HopDongGoiTap> HopDongGoiTaps { get; set; }
        public DbSet<HopDongPT> HopDongPTs { get; set; }
        public DbSet<BuoiTapPT> BuoiTapPTs { get; set; }
        public DbSet<LopHocNhom> LopHocNhoms { get; set; }
        public DbSet<LichLopNhom> LichLopNhoms { get; set; }
        public DbSet<DangKyLopNhom> DangKyLopNhoms { get; set; }
        public DbSet<PhongTap> PhongTaps { get; set; }
        public DbSet<ThietBi> ThietBis { get; set; }
        public DbSet<BaoTriThietBi> BaoTriThietBis { get; set; }
        public DbSet<DiemDanhThanhVien> DiemDanhThanhViens { get; set; }
        public DbSet<DiemDanhNhanVien> DiemDanhNhanViens { get; set; }
        public DbSet<HoaDon> HoaDons { get; set; }
        public DbSet<ChiTietHoaDon> ChiTietHoaDons { get; set; }
        #endregion
    }
}
