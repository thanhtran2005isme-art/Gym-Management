using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public class TrainerService : ITrainerService
    {
        #region Quản lý học viên

        public async Task<List<HocVienDto>> GetMyMembersAsync(int trainerId)
        {
            // TODO: Query từ database
            return await Task.FromResult(new List<HocVienDto>
            {
                new HocVienDto
                {
                    Id = 1,
                    MaThanhVien = "TV001",
                    HoTen = "Trần Văn B",
                    Email = "tranvanb@email.com",
                    SoDienThoai = "0901234567",
                    NgaySinh = new DateTime(1995, 5, 15),
                    GioiTinh = "Nam",
                    NgayDangKy = DateTime.Now.AddMonths(-3),
                    TrangThai = "Active"
                },
                new HocVienDto
                {
                    Id = 2,
                    MaThanhVien = "TV002",
                    HoTen = "Lê Thị C",
                    Email = "lethic@email.com",
                    SoDienThoai = "0907654321",
                    NgaySinh = new DateTime(1998, 8, 20),
                    GioiTinh = "Nữ",
                    NgayDangKy = DateTime.Now.AddMonths(-1),
                    TrangThai = "Active"
                }
            });
        }

        public async Task<HocVienChiTietDto?> GetMemberByIdAsync(int trainerId, int memberId)
        {
            var members = await GetMyMembersAsync(trainerId);
            var member = members.FirstOrDefault(m => m.Id == memberId);
            if (member == null) return null;

            return new HocVienChiTietDto
            {
                Id = member.Id,
                MaThanhVien = member.MaThanhVien,
                HoTen = member.HoTen,
                Email = member.Email,
                SoDienThoai = member.SoDienThoai,
                NgaySinh = member.NgaySinh,
                GioiTinh = member.GioiTinh,
                NgayDangKy = member.NgayDangKy,
                TrangThai = member.TrangThai,
                TongSoBuoiTap = 15,
                SoBuoiHoanThanh = 12,
                SoBuoiVang = 3,
                TyLeHoanThanh = 80.0,
                BuoiTapGanNhat = DateTime.Now.AddDays(-2)
            };
        }

        public async Task<List<HopDongPTDto>> GetMemberContractsAsync(int trainerId, int memberId)
        {
            return await Task.FromResult(new List<HopDongPTDto>
            {
                new HopDongPTDto
                {
                    Id = 1,
                    MaHopDong = "HD001",
                    TrainerId = trainerId,
                    MaThanhVien = memberId,
                    TenGoiPT = "Gói PT 10 buổi",
                    TongSoBuoi = 10,
                    SoBuoiDaSuDung = 5,
                    SoBuoiConLai = 5,
                    TrangThai = "Active"
                }
            });
        }

        public async Task<List<BuoiTapPTDto>> GetMemberSessionsAsync(int trainerId, int memberId)
        {
            return await Task.FromResult(new List<BuoiTapPTDto>());
        }

        public async Task<List<HocVienDto>> GetActiveMembersAsync(int trainerId)
        {
            var members = await GetMyMembersAsync(trainerId);
            return members.Where(m => m.TrangThai == "Active").ToList();
        }

        #endregion

        #region Thông tin cá nhân PT

        public async Task<TrainerProfileDto?> GetProfileAsync(int trainerId)
        {
            return await Task.FromResult(new TrainerProfileDto
            {
                Id = trainerId,
                MaNhanVien = "PT001",
                HoTen = "Nguyễn Văn A",
                Email = "nguyenvana@gym.com",
                SoDienThoai = "0912345678",
                NgaySinh = new DateTime(1990, 1, 15),
                GioiTinh = "Nam",
                DiaChi = "123 Đường ABC, Quận 1, TP.HCM",
                ChuyenMon = "Gym, Yoga, Cardio",
                MoTa = "PT chuyên nghiệp với 5 năm kinh nghiệm",
                KinhNghiem = 5,
                ChungChi = new List<string> { "ACE Certified", "NASM CPT" },
                NgayVaoLam = DateTime.Now.AddYears(-3),
                TrangThai = "Active"
            });
        }

        public async Task<TrainerProfileDto?> UpdateProfileAsync(int trainerId, UpdateTrainerProfileDto dto)
        {
            var profile = await GetProfileAsync(trainerId);
            if (profile == null) return null;

            if (dto.HoTen != null) profile.HoTen = dto.HoTen;
            if (dto.SoDienThoai != null) profile.SoDienThoai = dto.SoDienThoai;
            if (dto.DiaChi != null) profile.DiaChi = dto.DiaChi;
            if (dto.AnhDaiDien != null) profile.AnhDaiDien = dto.AnhDaiDien;
            if (dto.ChuyenMon != null) profile.ChuyenMon = dto.ChuyenMon;
            if (dto.MoTa != null) profile.MoTa = dto.MoTa;

            return profile;
        }

        public async Task<ChuyenMonDto?> GetSpecializationAsync(int trainerId)
        {
            return await Task.FromResult(new ChuyenMonDto
            {
                Id = 1,
                TenChuyenMon = "Gym & Fitness",
                MoTa = "Chuyên về tập gym, giảm cân, tăng cơ",
                SoNamKinhNghiem = 5,
                ChungChi = new List<string> { "ACE Certified Personal Trainer", "NASM CPT" }
            });
        }

        #endregion

        #region Thống kê & Báo cáo

        public async Task<ThongKeTongQuanDto> GetStatisticsAsync(int trainerId)
        {
            return await Task.FromResult(new ThongKeTongQuanDto
            {
                SoHocVienHienTai = 15,
                SoBuoiTapTrongThang = 45,
                SoHopDongActive = 12,
                SoBuoiTapHomNay = 3,
                SoBuoiTapTuanNay = 18,
                TyLeHoanThanhBuoiTap = 92.5
            });
        }

        public async Task<DoanhThuDto> GetRevenueAsync(int trainerId, int month, int year)
        {
            return await Task.FromResult(new DoanhThuDto
            {
                Thang = month,
                Nam = year,
                TongDoanhThu = 50000000,
                HoaHong = 15000000,
                SoHopDongMoi = 5,
                SoBuoiDayHoanThanh = 45,
                ChiTiet = new List<DoanhThuChiTietDto>
                {
                    new DoanhThuChiTietDto
                    {
                        MaHopDong = "HD001",
                        TenHocVien = "Trần Văn B",
                        TenGoiPT = "Gói PT 10 buổi",
                        GiaTriHopDong = 5000000,
                        HoaHong = 1500000,
                        NgayTao = DateTime.Now.AddDays(-15)
                    }
                }
            });
        }

        public async Task<TongHopBuoiTapDto> GetSessionsSummaryAsync(int trainerId, DateTime from, DateTime to)
        {
            return await Task.FromResult(new TongHopBuoiTapDto
            {
                TuNgay = from,
                DenNgay = to,
                TongBuoiTap = 30,
                BuoiHoanThanh = 27,
                BuoiVang = 2,
                BuoiHuy = 1,
                TyLeHoanThanh = 90.0,
                TheoNgay = new List<BuoiTapTheoNgayDto>()
            });
        }

        public async Task<TyLeThamGiaDto> GetAttendanceRateAsync(int trainerId)
        {
            return await Task.FromResult(new TyLeThamGiaDto
            {
                TyLeThamGiaTrungBinh = 88.5,
                TheoHocVien = new List<TyLeThamGiaHocVienDto>
                {
                    new TyLeThamGiaHocVienDto
                    {
                        HocVienId = 1,
                        TenHocVien = "Trần Văn B",
                        TongBuoi = 10,
                        BuoiThamGia = 9,
                        TyLe = 90.0
                    }
                }
            });
        }

        #endregion
    }
}
