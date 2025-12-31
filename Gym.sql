--------------------------------------------------
-- Tao database (neu chua co)
--------------------------------------------------
CREATE DATABASE GymManagement;
GO

USE GymManagement;
GO

--------------------------------------------------
-- NHOM 1: DANH MUC HE THONG
--------------------------------------------------

-- Bang quyen/vai tro he thong (Admin, Thu ngan, HLV...)
CREATE TABLE dbo.VaiTro (
    MaVaiTro    INT IDENTITY(1,1) PRIMARY KEY,
    TenVaiTro   NVARCHAR(100) NOT NULL,
    MoTa        NVARCHAR(255) NULL
);

-- Bang chuc vu nhan vien
CREATE TABLE dbo.ChucVu (
    MaChucVu    INT IDENTITY(1,1) PRIMARY KEY,
    TenChucVu   NVARCHAR(100) NOT NULL,
    MoTa        NVARCHAR(255) NULL
);

--------------------------------------------------
-- NHOM 2: PHONG TAP, LOP HOC, GOI TAP
--------------------------------------------------

-- Phong tap
CREATE TABLE dbo.PhongTap (
    MaPhong     INT IDENTITY(1,1) PRIMARY KEY,
    TenPhong    NVARCHAR(100) NOT NULL,
    SucChua     INT NULL,
    MoTa        NVARCHAR(255) NULL,
    TrangThai   TINYINT NOT NULL DEFAULT 1   -- 1: Hoat dong, 0: Ngung
);

-- Lop hoc nhom (Yoga, Cardio...)
CREATE TABLE dbo.LopHocNhom (
    MaLopHoc    INT IDENTITY(1,1) PRIMARY KEY,
    TenLopHoc   NVARCHAR(100) NOT NULL,
    LoaiLop     NVARCHAR(50) NULL,          -- Yoga, Cardio,...
    DoKho       TINYINT NULL,               -- 1-5
    MoTa        NVARCHAR(255) NULL,
    TrangThai   TINYINT NOT NULL DEFAULT 1  -- 1: Hoat dong, 0: Ngung
);

-- Goi tap
CREATE TABLE dbo.GoiTap (
    MaGoiTap            INT IDENTITY(1,1) PRIMARY KEY,
    TenGoiTap           NVARCHAR(100) NOT NULL,
    SoThang             INT NOT NULL,              -- Thoi han theo thang
    SoLanTapToiDa       INT NULL,                  -- Neu gioi han so lan tap
    Gia                 DECIMAL(18,2) NOT NULL,
    MoTa                NVARCHAR(255) NULL,
    TrangThai           TINYINT NOT NULL DEFAULT 1  -- 1: Dang kinh doanh, 0: Ngung
);

-- Goi PT (Personal Training)
CREATE TABLE dbo.GoiPT (
    MaGoiPT     INT IDENTITY(1,1) PRIMARY KEY,
    TenGoiPT    NVARCHAR(100) NOT NULL,
    SoBuoi      INT NOT NULL,
    Gia         DECIMAL(18,2) NOT NULL,
    MoTa        NVARCHAR(255) NULL,
    TrangThai   TINYINT NOT NULL DEFAULT 1
);

--------------------------------------------------
-- NHOM 3: THANH VIEN & NHAN VIEN
--------------------------------------------------

-- Thanh vien (hoi vien)
CREATE TABLE dbo.ThanhVien (
    MaThanhVien INT IDENTITY(1,1) PRIMARY KEY,
    MaThe       NVARCHAR(20) NULL UNIQUE,          -- Ma the tu/QR
    HoTen       NVARCHAR(100) NOT NULL,
    NgaySinh    DATE NULL,
    GioiTinh    CHAR(1) NULL,                      -- 'M','F'
    SoDienThoai NVARCHAR(20) NULL,
    Email       NVARCHAR(100) NULL,
    DiaChi      NVARCHAR(255) NULL,
    NgayDangKy  DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    TrangThai   TINYINT NOT NULL DEFAULT 1,        -- 1: Dang hoat dong, 0: Ngung
    GhiChu      NVARCHAR(255) NULL
);

-- Nhan vien
CREATE TABLE dbo.NhanVien (
    MaNhanVien  INT IDENTITY(1,1) PRIMARY KEY,
    HoTen       NVARCHAR(100) NOT NULL,
    NgaySinh    DATE NULL,
    GioiTinh    CHAR(1) NULL,
    SoDienThoai NVARCHAR(20) NULL,
    Email       NVARCHAR(100) NULL,
    DiaChi      NVARCHAR(255) NULL,
    NgayVaoLam  DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    MaChucVu    INT NULL,
    TrangThai   TINYINT NOT NULL DEFAULT 1,        -- 1: Dang lam, 0: Nghi
    GhiChu      NVARCHAR(255) NULL,
    CONSTRAINT FK_NhanVien_ChucVu 
        FOREIGN KEY (MaChucVu) REFERENCES dbo.ChucVu(MaChucVu)
);

-- Huan luyen vien (mo rong tu nhan vien)
CREATE TABLE dbo.HuanLuyenVien (
    MaHuanLuyenVien INT IDENTITY(1,1) PRIMARY KEY,
    MaNhanVien      INT NOT NULL UNIQUE,           -- 1 nhan vien = 1 HLV
    ChuyenMon       NVARCHAR(100) NULL,
    MoTa            NVARCHAR(255) NULL,
    MucLuongCoBan   DECIMAL(18,2) NULL,
    TiLeHoaHongPT   DECIMAL(5,2) NULL,             -- Phan tram hoa hong
    CONSTRAINT FK_HLV_NhanVien 
        FOREIGN KEY (MaNhanVien) REFERENCES dbo.NhanVien(MaNhanVien)
);

--------------------------------------------------
-- NHOM 4: TAI KHOAN HE THONG
--------------------------------------------------

-- Tai khoan dang nhap (co the gan voi ThanhVien hoac NhanVien)
CREATE TABLE dbo.TaiKhoan (
    MaTaiKhoan  INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) NOT NULL UNIQUE,
    MatKhauHash NVARCHAR(255) NOT NULL,            -- Nen luu hash, khong luu mat khau thuan
    MaVaiTro    INT NOT NULL,
    MaNhanVien  INT NULL,
    MaThanhVien INT NULL,
    TrangThai   TINYINT NOT NULL DEFAULT 1,        -- 1: Hoat dong, 0: Khoa
    NgayTao     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_TaiKhoan_VaiTro 
        FOREIGN KEY (MaVaiTro) REFERENCES dbo.VaiTro(MaVaiTro),
    CONSTRAINT FK_TaiKhoan_NhanVien 
        FOREIGN KEY (MaNhanVien) REFERENCES dbo.NhanVien(MaNhanVien),
    CONSTRAINT FK_TaiKhoan_ThanhVien 
        FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    -- Dam bao chi gan cho 1 trong 2: Nhan vien HOAC Thanh vien
    CONSTRAINT CK_TaiKhoan_OneOwner CHECK (
        (MaNhanVien IS NOT NULL AND MaThanhVien IS NULL) OR
        (MaNhanVien IS NULL AND MaThanhVien IS NOT NULL)
    )
);

--------------------------------------------------
-- NHOM 5: HOP DONG GOI TAP & PT
--------------------------------------------------

-- Hop dong mua goi tap
CREATE TABLE dbo.HopDongGoiTap (
    MaHopDongGoiTap INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    MaGoiTap        INT NOT NULL,
    NgayBatDau      DATE NOT NULL,
    NgayKetThuc     DATE NOT NULL,
    TongTien        DECIMAL(18,2) NOT NULL,
    SoTienGiam      DECIMAL(18,2) NOT NULL DEFAULT 0,
    SoTienPhaiTra   DECIMAL(18,2) NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,    -- 1: Hieu luc, 2: Het han, 0: Huy
    NgayTao         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    MaNhanVienTao   INT NULL,
    CONSTRAINT FK_HopDongGT_ThanhVien 
        FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_HopDongGT_GoiTap 
        FOREIGN KEY (MaGoiTap) REFERENCES dbo.GoiTap(MaGoiTap),
    CONSTRAINT FK_HopDongGT_NhanVien 
        FOREIGN KEY (MaNhanVienTao) REFERENCES dbo.NhanVien(MaNhanVien)
);

-- Hop dong PT (Personal Training)
CREATE TABLE dbo.HopDongPT (
    MaHopDongPT     INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    MaHuanLuyenVien INT NOT NULL,
    MaGoiPT         INT NOT NULL,
    NgayBatDau      DATE NOT NULL,
    NgayKetThuc     DATE NOT NULL,
    TongTien        DECIMAL(18,2) NOT NULL,
    SoTienGiam      DECIMAL(18,2) NOT NULL DEFAULT 0,
    SoTienPhaiTra   DECIMAL(18,2) NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,    -- 1: Hieu luc, 2: Het han, 0: Huy
    NgayTao         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    MaNhanVienTao   INT NULL,
    CONSTRAINT FK_HopDongPT_ThanhVien 
        FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_HopDongPT_HLV 
        FOREIGN KEY (MaHuanLuyenVien) REFERENCES dbo.HuanLuyenVien(MaHuanLuyenVien),
    CONSTRAINT FK_HopDongPT_GoiPT 
        FOREIGN KEY (MaGoiPT) REFERENCES dbo.GoiPT(MaGoiPT),
    CONSTRAINT FK_HopDongPT_NhanVien 
        FOREIGN KEY (MaNhanVienTao) REFERENCES dbo.NhanVien(MaNhanVien)
);

-- Cac buoi tap PT cu the
CREATE TABLE dbo.BuoiTapPT (
    MaBuoiTapPT     INT IDENTITY(1,1) PRIMARY KEY,
    MaHopDongPT     INT NOT NULL,
    ThoiGianBatDau  DATETIME2 NOT NULL,
    ThoiGianKetThuc DATETIME2 NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,    -- 1: Dat lich, 2: Hoan thanh, 3: Huy
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_BuoiTapPT_HopDongPT 
        FOREIGN KEY (MaHopDongPT) REFERENCES dbo.HopDongPT(MaHopDongPT)
);

--------------------------------------------------
-- NHOM 6: LOP HOC NHOM (LICH & DANG KY)
--------------------------------------------------

-- Lich lop nhom
CREATE TABLE dbo.LichLopNhom (
    MaLichLopNhom   INT IDENTITY(1,1) PRIMARY KEY,
    MaLopHoc        INT NOT NULL,
    MaPhong         INT NOT NULL,
    MaHuanLuyenVien INT NOT NULL,
    ThuTrongTuan    TINYINT NOT NULL,              -- 1-7: Thu 2 -> Chu nhat (tuy quy uoc)
    GioBatDau       TIME(0) NOT NULL,
    GioKetThuc      TIME(0) NOT NULL,
    SoLuongToiDa    INT NOT NULL,
    NgayBatDau      DATE NOT NULL,
    NgayKetThuc     DATE NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,
    CONSTRAINT FK_LichLopNhom_LopHoc 
        FOREIGN KEY (MaLopHoc) REFERENCES dbo.LopHocNhom(MaLopHoc),
    CONSTRAINT FK_LichLopNhom_PhongTap 
        FOREIGN KEY (MaPhong) REFERENCES dbo.PhongTap(MaPhong),
    CONSTRAINT FK_LichLopNhom_HLV 
        FOREIGN KEY (MaHuanLuyenVien) REFERENCES dbo.HuanLuyenVien(MaHuanLuyenVien)
);

-- Dang ky lop nhom
CREATE TABLE dbo.DangKyLopNhom (
    MaDangKy        INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    MaLichLopNhom   INT NOT NULL,
    NgayDangKy      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    TrangThai       TINYINT NOT NULL DEFAULT 1,    -- 1: Dang ky, 2: Huy
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT UQ_DangKy_Lich_ThanhVien UNIQUE (MaThanhVien, MaLichLopNhom),
    CONSTRAINT FK_DangKyLopNhom_ThanhVien 
        FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_DangKyLopNhom_Lich 
        FOREIGN KEY (MaLichLopNhom) REFERENCES dbo.LichLopNhom(MaLichLopNhom)
);

--------------------------------------------------
-- NHOM 7: DIEM DANH
--------------------------------------------------

-- Diem danh thanh vien (check-in)
CREATE TABLE dbo.DiemDanhThanhVien (
    MaDiemDanh      INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    ThoiGianVao     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ThoiGianRa      DATETIME2 NULL,
    HinhThuc        NVARCHAR(50) NULL,             -- Quet the, QR, App...
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_DiemDanhTV_ThanhVien 
        FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien)
);

-- Diem danh nhan vien (cham cong)
CREATE TABLE dbo.DiemDanhNhanVien (
    MaDiemDanhNV    INT IDENTITY(1,1) PRIMARY KEY,
    MaNhanVien      INT NOT NULL,
    ThoiGianVao     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ThoiGianRa      DATETIME2 NULL,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_DiemDanhNV_NhanVien 
        FOREIGN KEY (MaNhanVien) REFERENCES dbo.NhanVien(MaNhanVien)
);

--------------------------------------------------
-- NHOM 8: HOA DON & THANH TOAN
--------------------------------------------------

-- Hoa don
CREATE TABLE dbo.HoaDon (
    MaHoaDon        INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NULL,                      -- Khach le co the NULL
    MaNhanVienLap   INT NOT NULL,
    NgayLap         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    TongTien        DECIMAL(18,2) NOT NULL,
    GiamGia         DECIMAL(18,2) NOT NULL DEFAULT 0,
    SoTienThanhToan DECIMAL(18,2) NOT NULL,
    HinhThucThanhToan NVARCHAR(50) NOT NULL,       -- Tien mat, The, Chuyen khoan...
    TrangThai       TINYINT NOT NULL DEFAULT 1,    -- 1: Da thanh toan, 0: Huy
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_HoaDon_ThanhVien 
        FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_HoaDon_NhanVien 
        FOREIGN KEY (MaNhanVienLap) REFERENCES dbo.NhanVien(MaNhanVien)
);

-- Chi tiet hoa don
CREATE TABLE dbo.ChiTietHoaDon (
    MaChiTiet       INT IDENTITY(1,1) PRIMARY KEY,
    MaHoaDon        INT NOT NULL,
    LoaiSanPham     NVARCHAR(50) NOT NULL,         -- GoiTap, GoiPT, SanPham, DichVu...
    MaThamChieu     INT NOT NULL,                  -- ID cua GoiTap / GoiPT / SanPham...
    SoLuong         INT NOT NULL DEFAULT 1,
    DonGia          DECIMAL(18,2) NOT NULL,
    ThanhTien       DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_ChiTietHoaDon_HoaDon 
        FOREIGN KEY (MaHoaDon) REFERENCES dbo.HoaDon(MaHoaDon)
);

--------------------------------------------------
-- NHOM 9: THIET BI & BAO TRI
--------------------------------------------------

-- Thiet bi trong phong tap
CREATE TABLE dbo.ThietBi (
    MaThietBi   INT IDENTITY(1,1) PRIMARY KEY,
    TenThietBi  NVARCHAR(100) NOT NULL,
    MaPhong     INT NULL,
    HangSanXuat NVARCHAR(100) NULL,
    NgayMua     DATE NULL,
    GiaMua      DECIMAL(18,2) NULL,
    TrangThai   NVARCHAR(50) NULL,                 -- Tot, Hong, Dang bao tri...
    MoTa        NVARCHAR(255) NULL,
    CONSTRAINT FK_ThietBi_PhongTap 
        FOREIGN KEY (MaPhong) REFERENCES dbo.PhongTap(MaPhong)
);

-- Lich su bao tri thiet bi
CREATE TABLE dbo.BaoTriThietBi (
    MaBaoTri            INT IDENTITY(1,1) PRIMARY KEY,
    MaThietBi           INT NOT NULL,
    NgayBaoTri          DATE NOT NULL,
    NoiDung             NVARCHAR(255) NULL,
    ChiPhi              DECIMAL(18,2) NULL,
    MaNhanVienPhuTrach  INT NULL,
    GhiChu              NVARCHAR(255) NULL,
    CONSTRAINT FK_BaoTri_ThietBi 
        FOREIGN KEY (MaThietBi) REFERENCES dbo.ThietBi(MaThietBi),
    CONSTRAINT FK_BaoTri_NhanVien 
        FOREIGN KEY (MaNhanVienPhuTrach) REFERENCES dbo.NhanVien(MaNhanVien)
);
GO
