CREATE DATABASE GymManagement;
GO

USE GymManagement;
GO

-- Bảng ChucVu
CREATE TABLE ChucVu (
    MaChucVu INT IDENTITY(1,1) PRIMARY KEY,
    TenChucVu NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(255) NULL
);

-- Bảng ThanhVien
CREATE TABLE ThanhVien (
    MaThanhVien INT IDENTITY(1,1) PRIMARY KEY,
    MaThe NVARCHAR(20) NULL UNIQUE,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE NULL,
    GioiTinh CHAR(1) NULL,
    SoDienThoai NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    DiaChi NVARCHAR(255) NULL,
    NgayDangKy DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    TrangThai TINYINT NOT NULL DEFAULT 1
);

-- Bảng GoiTap
CREATE TABLE GoiTap (
    MaGoiTap INT IDENTITY(1,1) PRIMARY KEY,
    TenGoiTap NVARCHAR(100) NOT NULL,
    SoThang INT NOT NULL,
    SoLanTapToiDa INT NULL,
    Gia DECIMAL(18,2) NOT NULL,
    MoTa NVARCHAR(255) NULL,
    TrangThai TINYINT NOT NULL DEFAULT 1
);

-- Bảng NhanVien
CREATE TABLE NhanVien (
    MaNhanVien INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE NULL,
    GioiTinh CHAR(1) NULL,
    SoDienThoai NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    DiaChi NVARCHAR(255) NULL,
    NgayVaoLam DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    MaChucVu INT NULL,
    TrangThai TINYINT NOT NULL DEFAULT 1,
    CONSTRAINT FK_NhanVien_ChucVu FOREIGN KEY (MaChucVu) REFERENCES ChucVu(MaChucVu)
);
GO


-- Insert dữ liệu mẫu
INSERT INTO ChucVu (TenChucVu, MoTa) VALUES 
(N'Quản lý', N'Quản lý phòng tập'),
(N'Lễ tân', N'Tiếp đón khách hàng'),
(N'Huấn luyện viên', N'Hướng dẫn tập luyện'),
(N'Kế toán', N'Quản lý tài chính'),
(N'Bảo vệ', N'Bảo vệ an ninh');

INSERT INTO GoiTap (TenGoiTap, SoThang, Gia, MoTa) VALUES
(N'Gói 1 tháng', 1, 500000, N'Gói tập 1 tháng cơ bản'),
(N'Gói 3 tháng', 3, 1200000, N'Gói tập 3 tháng tiết kiệm'),
(N'Gói 6 tháng', 6, 2000000, N'Gói tập 6 tháng ưu đãi'),
(N'Gói 12 tháng', 12, 3500000, N'Gói tập 1 năm VIP');
GO

-- Bảng DangKyGoiTap (Đăng ký gói tập / Membership)
CREATE TABLE DangKyGoiTap (
    MaDangKy INT IDENTITY(1,1) PRIMARY KEY,
    MaThanhVien INT NOT NULL,
    MaGoiTap INT NOT NULL,
    NgayDangKy DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    SoLanTapConLai INT NULL,
    TongTien DECIMAL(18,2) NOT NULL,
    GhiChu NVARCHAR(255) NULL,
    TrangThai TINYINT NOT NULL DEFAULT 1,
    CONSTRAINT FK_DangKy_ThanhVien FOREIGN KEY (MaThanhVien) REFERENCES ThanhVien(MaThanhVien),
    CONSTRAINT FK_DangKy_GoiTap FOREIGN KEY (MaGoiTap) REFERENCES GoiTap(MaGoiTap)
);
GO

CREATE INDEX IX_DangKyGoiTap_ThanhVien ON DangKyGoiTap(MaThanhVien);
CREATE INDEX IX_DangKyGoiTap_NgayKetThuc ON DangKyGoiTap(NgayKetThuc);
GO
