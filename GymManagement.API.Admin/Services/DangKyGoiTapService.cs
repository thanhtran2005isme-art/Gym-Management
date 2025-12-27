using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Data;

namespace GymManagement.API.Admin.Services
{
    public class DangKyGoiTapService : IDangKyGoiTapService
    {
        private readonly IDangKyGoiTapRepository _repo;
        private readonly IGoiTapRepository _goiTapRepo;

        public DangKyGoiTapService(IDangKyGoiTapRepository repo, IGoiTapRepository goiTapRepo)
        {
            _repo = repo;
            _goiTapRepo = goiTapRepo;
        }

        public List<DangKyGoiTapDto> GetAll() => _repo.GetAll();
        public DangKyGoiTapDto? GetById(int id) => _repo.GetById(id);
        public List<DangKyGoiTapDto> GetByThanhVien(int maThanhVien) => _repo.GetByThanhVien(maThanhVien);
        public DangKyGoiTapDto? GetActiveByThanhVien(int maThanhVien) => _repo.GetActiveByThanhVien(maThanhVien);

        public DangKyGoiTapDto Create(DangKyGoiTapCreateDto dto)
        {
            var goiTap = _goiTapRepo.GetById(dto.MaGoiTap);
            if (goiTap == null || goiTap.TrangThai != 1)
                throw new ArgumentException("Gói tập không tồn tại hoặc không hoạt động");

            var ngayBatDau = dto.NgayBatDau ?? DateTime.Today;
            var ngayKetThuc = ngayBatDau.AddMonths(goiTap.SoThang);

            var id = _repo.Create(dto.MaThanhVien, dto.MaGoiTap, ngayBatDau, ngayKetThuc,
                goiTap.SoLanTapToiDa, goiTap.Gia, dto.GhiChu);

            return _repo.GetById(id) ?? throw new Exception("Lỗi tạo đăng ký");
        }

        public DangKyGoiTapDto? GiaHan(GiaHanGoiTapDto dto)
        {
            var current = _repo.GetById(dto.MaDangKy);
            if (current == null) return null;

            var goiTap = _goiTapRepo.GetById(dto.MaGoiTap);
            if (goiTap == null || goiTap.TrangThai != 1)
                throw new ArgumentException("Gói tập không tồn tại hoặc không hoạt động");

            var ngayBatDau = current.NgayKetThuc > DateTime.Today ? current.NgayKetThuc : DateTime.Today;
            var ngayKetThuc = ngayBatDau.AddMonths(goiTap.SoThang);

            var id = _repo.Create(current.MaThanhVien, dto.MaGoiTap, ngayBatDau, ngayKetThuc,
                goiTap.SoLanTapToiDa, goiTap.Gia, dto.GhiChu ?? $"Gia hạn từ đăng ký #{dto.MaDangKy}");

            return _repo.GetById(id);
        }

        public bool HuyDangKy(int id) => _repo.UpdateTrangThai(id, 2);
        public List<DangKyGoiTapDto> GetSapHetHan(int soNgay = 7) => _repo.GetSapHetHan(soNgay);
        public List<DangKyGoiTapDto> GetActive() => _repo.GetActive();
        public (List<DangKyGoiTapDto> Items, int Total) GetPaged(int page, int pageSize) => _repo.GetPaged(page, pageSize);
    }
}
