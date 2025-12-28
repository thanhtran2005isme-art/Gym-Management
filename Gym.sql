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

-- Bang quyen/vai tro he thong (Admin, HLV, Hoi vien)
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
-- NHOM 2: PHONG TAP, THIET BI, GOI TAP
--------------------------------------------------

-- Phong tap
CREATE TABLE dbo.PhongTap (
    MaPhong     INT IDENTITY(1,1) PRIMARY KEY,
    TenPhong    NVARCHAR(100) NOT NULL,
    SucChua     INT NULL,
    MoTa        NVARCHAR(255) NULL,
    TrangThai   TINYINT NOT NULL DEFAULT 1
);

-- Thiet bi trong phong tap
CREATE TABLE dbo.ThietBi (
    MaThietBi   INT IDENTITY(1,1) PRIMARY KEY,
    TenThietBi  NVARCHAR(100) NOT NULL,
    MaPhong     INT NULL,
    HangSanXuat NVARCHAR(100) NULL,
    NgayMua     DATE NULL,
    GiaMua      DECIMAL(18,2) NULL,
    TrangThai   NVARCHAR(50) NULL,
    MoTa        NVARCHAR(255) NULL,
    CONSTRAINT FK_ThietBi_PhongTap FOREIGN KEY (MaPhong) REFERENCES dbo.PhongTap(MaPhong)
);

-- Goi tap
CREATE TABLE dbo.GoiTap (
    MaGoiTap        INT IDENTITY(1,1) PRIMARY KEY,
    TenGoiTap       NVARCHAR(100) NOT NULL,
    SoThang         INT NOT NULL,
    SoLanTapToiDa   INT NULL,
    Gia             DECIMAL(18,2) NOT NULL,
    MoTa            NVARCHAR(255) NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1
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
    MaThe       NVARCHAR(20) NULL UNIQUE,
    HoTen       NVARCHAR(100) NOT NULL,
    NgaySinh    DATE NULL,
    GioiTinh    CHAR(1) NULL,
    SoDienThoai NVARCHAR(20) NULL,
    Email       NVARCHAR(100) NULL,
    DiaChi      NVARCHAR(255) NULL,
    NgayDangKy  DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    TrangThai   TINYINT NOT NULL DEFAULT 1,
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
    TrangThai   TINYINT NOT NULL DEFAULT 1,
    GhiChu      NVARCHAR(255) NULL,
    CONSTRAINT FK_NhanVien_ChucVu FOREIGN KEY (MaChucVu) REFERENCES dbo.ChucVu(MaChucVu)
);

-- Huan luyen vien (mo rong tu nhan vien)
CREATE TABLE dbo.HuanLuyenVien (
    MaHuanLuyenVien INT IDENTITY(1,1) PRIMARY KEY,
    MaNhanVien      INT NOT NULL UNIQUE,
    ChuyenMon       NVARCHAR(100) NULL,
    MoTa            NVARCHAR(255) NULL,
    MucLuongCoBan   DECIMAL(18,2) NULL,
    TiLeHoaHongPT   DECIMAL(5,2) NULL,
    CONSTRAINT FK_HLV_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES dbo.NhanVien(MaNhanVien)
);

--------------------------------------------------
-- NHOM 4: TAI KHOAN HE THONG
--------------------------------------------------

CREATE TABLE dbo.TaiKhoan (
    MaTaiKhoan  INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) NOT NULL UNIQUE,
    MatKhauHash NVARCHAR(255) NOT NULL,
    MaVaiTro    INT NOT NULL,
    MaNhanVien  INT NULL,
    MaThanhVien INT NULL,
    TrangThai   TINYINT NOT NULL DEFAULT 1,
    NgayTao     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_TaiKhoan_VaiTro FOREIGN KEY (MaVaiTro) REFERENCES dbo.VaiTro(MaVaiTro),
    CONSTRAINT FK_TaiKhoan_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES dbo.NhanVien(MaNhanVien),
    CONSTRAINT FK_TaiKhoan_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien)
);


--------------------------------------------------
-- NHOM 5: HOP DONG GOI TAP & PT
--------------------------------------------------

-- Hop dong mua goi tap
CREATE TABLE dbo.HopDongGoiTap (
    MaHopDong       INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    MaGoiTap        INT NOT NULL,
    NgayBatDau      DATE NOT NULL,
    NgayKetThuc     DATE NOT NULL,
    TongTien        DECIMAL(18,2) NOT NULL,
    SoTienGiam      DECIMAL(18,2) NOT NULL DEFAULT 0,
    SoTienPhaiTra   DECIMAL(18,2) NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,
    NgayTao         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    MaNhanVienTao   INT NULL,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_HopDongGT_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_HopDongGT_GoiTap FOREIGN KEY (MaGoiTap) REFERENCES dbo.GoiTap(MaGoiTap),
    CONSTRAINT FK_HopDongGT_NhanVien FOREIGN KEY (MaNhanVienTao) REFERENCES dbo.NhanVien(MaNhanVien)
);

-- Hop dong PT (Personal Training)
CREATE TABLE dbo.HopDongPT (
    MaHopDongPT     INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    MaHuanLuyenVien INT NOT NULL,
    MaGoiPT         INT NOT NULL,
    NgayBatDau      DATE NOT NULL,
    NgayKetThuc     DATE NOT NULL,
    SoBuoiConLai    INT NOT NULL,
    TongTien        DECIMAL(18,2) NOT NULL,
    SoTienGiam      DECIMAL(18,2) NOT NULL DEFAULT 0,
    SoTienPhaiTra   DECIMAL(18,2) NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,
    NgayTao         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    MaNhanVienTao   INT NULL,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_HopDongPT_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_HopDongPT_HLV FOREIGN KEY (MaHuanLuyenVien) REFERENCES dbo.HuanLuyenVien(MaHuanLuyenVien),
    CONSTRAINT FK_HopDongPT_GoiPT FOREIGN KEY (MaGoiPT) REFERENCES dbo.GoiPT(MaGoiPT),
    CONSTRAINT FK_HopDongPT_NhanVien FOREIGN KEY (MaNhanVienTao) REFERENCES dbo.NhanVien(MaNhanVien)
);

-- Buoi tap PT cu the
CREATE TABLE dbo.BuoiTapPT (
    MaBuoiTapPT     INT IDENTITY(1,1) PRIMARY KEY,
    MaHopDongPT     INT NOT NULL,
    ThoiGianBatDau  DATETIME2 NOT NULL,
    ThoiGianKetThuc DATETIME2 NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_BuoiTapPT_HopDongPT FOREIGN KEY (MaHopDongPT) REFERENCES dbo.HopDongPT(MaHopDongPT)
);


--------------------------------------------------
-- NHOM 6: CHECK-IN & BUOI TAP
--------------------------------------------------

-- Diem danh thanh vien (check-in)
CREATE TABLE dbo.DiemDanh (
    MaDiemDanh      INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    ThoiGianVao     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ThoiGianRa      DATETIME2 NULL,
    HinhThuc        NVARCHAR(50) NULL,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_DiemDanh_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien)
);

-- Buoi tap cua hoi vien (ghi nhan sessions)
CREATE TABLE dbo.BuoiTap (
    MaBuoiTap       INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NOT NULL,
    MaHopDong       INT NULL,
    NgayTap         DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    ThoiGianBatDau  DATETIME2 NULL,
    ThoiGianKetThuc DATETIME2 NULL,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_BuoiTap_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_BuoiTap_HopDong FOREIGN KEY (MaHopDong) REFERENCES dbo.HopDongGoiTap(MaHopDong)
);

--------------------------------------------------
-- NHOM 7: HOA DON & THANH TOAN
--------------------------------------------------

-- Hoa don
CREATE TABLE dbo.HoaDon (
    MaHoaDon        INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NULL,
    MaNhanVienLap   INT NOT NULL,
    NgayLap         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    TongTien        DECIMAL(18,2) NOT NULL,
    GiamGia         DECIMAL(18,2) NOT NULL DEFAULT 0,
    SoTienPhaiTra   DECIMAL(18,2) NOT NULL,
    TrangThai       TINYINT NOT NULL DEFAULT 1,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_HoaDon_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien),
    CONSTRAINT FK_HoaDon_NhanVien FOREIGN KEY (MaNhanVienLap) REFERENCES dbo.NhanVien(MaNhanVien)
);

-- Chi tiet hoa don
CREATE TABLE dbo.ChiTietHoaDon (
    MaChiTiet       INT IDENTITY(1,1) PRIMARY KEY,
    MaHoaDon        INT NOT NULL,
    LoaiSanPham     NVARCHAR(50) NOT NULL,
    MaThamChieu     INT NOT NULL,
    SoLuong         INT NOT NULL DEFAULT 1,
    DonGia          DECIMAL(18,2) NOT NULL,
    ThanhTien       DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_ChiTietHoaDon_HoaDon FOREIGN KEY (MaHoaDon) REFERENCES dbo.HoaDon(MaHoaDon)
);

-- Thanh toan (1 hoa don co the tra nhieu lan)
CREATE TABLE dbo.ThanhToan (
    MaThanhToan     INT IDENTITY(1,1) PRIMARY KEY,
    MaHoaDon        INT NOT NULL,
    SoTien          DECIMAL(18,2) NOT NULL,
    NgayThanhToan   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    HinhThuc        NVARCHAR(50) NOT NULL,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_ThanhToan_HoaDon FOREIGN KEY (MaHoaDon) REFERENCES dbo.HoaDon(MaHoaDon)
);


--------------------------------------------------
-- NHOM 8: THONG BAO & AUDIT
--------------------------------------------------

-- Thong bao (nhac han, thong bao chung)
CREATE TABLE dbo.ThongBao (
    MaThongBao      INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien     INT NULL,
    TieuDe          NVARCHAR(200) NOT NULL,
    NoiDung         NVARCHAR(MAX) NULL,
    LoaiThongBao    NVARCHAR(50) NOT NULL,
    NgayTao         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayGui         DATETIME2 NULL,
    DaDoc           BIT NOT NULL DEFAULT 0,
    TrangThai       TINYINT NOT NULL DEFAULT 1,
    CONSTRAINT FK_ThongBao_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES dbo.ThanhVien(MaThanhVien)
);

-- Lich su thay doi goi (audit)
CREATE TABLE dbo.LichSuThayDoiGoi (
    MaLichSu        INT IDENTITY(1,1) PRIMARY KEY,
    MaHopDong       INT NOT NULL,
    LoaiThayDoi     NVARCHAR(50) NOT NULL,
    NoiDungCu       NVARCHAR(MAX) NULL,
    NoiDungMoi      NVARCHAR(MAX) NULL,
    NgayThayDoi     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    MaNguoiThayDoi  INT NULL,
    GhiChu          NVARCHAR(255) NULL,
    CONSTRAINT FK_LichSu_HopDong FOREIGN KEY (MaHopDong) REFERENCES dbo.HopDongGoiTap(MaHopDong),
    CONSTRAINT FK_LichSu_NguoiThayDoi FOREIGN KEY (MaNguoiThayDoi) REFERENCES dbo.NhanVien(MaNhanVien)
);
GO

--------------------------------------------------
-- DU LIEU MAU
--------------------------------------------------

INSERT INTO dbo.VaiTro (TenVaiTro, MoTa) VALUES 
(N'Admin', N'Quản trị hệ thống'),
(N'HuanLuyenVien', N'Huấn luyện viên'),
(N'HoiVien', N'Hội viên');

INSERT INTO dbo.ChucVu (TenChucVu, MoTa) VALUES 
(N'Quản lý', N'Quản lý phòng tập'),
(N'Lễ tân', N'Tiếp đón khách hàng'),
(N'Huấn luyện viên', N'Hướng dẫn tập luyện'),
(N'Kế toán', N'Quản lý tài chính');

INSERT INTO dbo.GoiTap (TenGoiTap, SoThang, Gia, MoTa) VALUES
(N'Gói 1 tháng', 1, 500000, N'Gói tập 1 tháng cơ bản'),
(N'Gói 3 tháng', 3, 1200000, N'Gói tập 3 tháng tiết kiệm'),
(N'Gói 6 tháng', 6, 2000000, N'Gói tập 6 tháng ưu đãi'),
(N'Gói 12 tháng', 12, 3500000, N'Gói tập 1 năm VIP');

INSERT INTO dbo.GoiPT (TenGoiPT, SoBuoi, Gia, MoTa) VALUES
(N'PT 10 buổi', 10, 2000000, N'Gói PT 10 buổi'),
(N'PT 20 buổi', 20, 3500000, N'Gói PT 20 buổi'),
(N'PT 30 buổi', 30, 4500000, N'Gói PT 30 buổi');
GO
