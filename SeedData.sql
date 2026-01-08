USE GymManagement;
GO

--------------------------------------------------
-- PHONG TAP
--------------------------------------------------
INSERT INTO dbo.PhongTap (TenPhong, SucChua, MoTa, TrangThai) VALUES 
(N'Phòng Gym chính', 50, N'Phòng tập gym với đầy đủ thiết bị', 1),
(N'Phòng Yoga', 30, N'Phòng tập yoga và thiền', 1),
(N'Phòng Cardio', 40, N'Phòng tập cardio với máy chạy bộ', 1),
(N'Phòng Group Fitness', 35, N'Phòng tập nhóm aerobic, zumba', 1),
(N'Phòng Boxing', 20, N'Phòng tập boxing và võ thuật', 1);

--------------------------------------------------
-- THIET BI
--------------------------------------------------
INSERT INTO dbo.ThietBi (TenThietBi, MaPhong, HangSanXuat, NgayMua, GiaMua, TrangThai, MoTa) VALUES 
(N'Máy chạy bộ Technogym', 3, N'Technogym', '2023-01-15', 50000000, N'Hoạt động', N'Máy chạy bộ cao cấp'),
(N'Máy đạp xe Spinning', 3, N'Life Fitness', '2023-02-20', 35000000, N'Hoạt động', N'Xe đạp spinning'),
(N'Bộ tạ đơn 1-50kg', 1, N'Rogue', '2023-01-10', 80000000, N'Hoạt động', N'Bộ tạ đơn đầy đủ'),
(N'Máy Smith Machine', 1, N'Hammer Strength', '2023-03-05', 120000000, N'Hoạt động', N'Máy tập đa năng'),
(N'Thảm Yoga', 2, N'Manduka', '2023-04-01', 5000000, N'Hoạt động', N'30 thảm yoga cao cấp'),
(N'Bao cát boxing', 5, N'Everlast', '2023-05-10', 15000000, N'Hoạt động', N'5 bao cát boxing'),
(N'Máy kéo cáp Cable', 1, N'Life Fitness', '2023-02-15', 90000000, N'Hoạt động', N'Máy kéo cáp đa năng'),
(N'Ghế tập bench press', 1, N'Rogue', '2023-01-20', 25000000, N'Hoạt động', N'5 ghế bench press');

--------------------------------------------------
-- NHAN VIEN
--------------------------------------------------
INSERT INTO dbo.NhanVien (HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, NgayVaoLam, MaChucVu, TrangThai) VALUES 
(N'Nguyễn Văn Admin', '1985-05-15', 'M', '0901234567', 'admin@gym.com', N'123 Nguyễn Huệ, Q1, HCM', '2020-01-01', 1, 1),
(N'Trần Thị Lễ Tân', '1995-08-20', 'F', '0902345678', 'letan@gym.com', N'456 Lê Lợi, Q1, HCM', '2022-03-15', 2, 1),
(N'Lê Văn PT1', '1990-03-10', 'M', '0903456789', 'pt1@gym.com', N'789 Trần Hưng Đạo, Q5, HCM', '2021-06-01', 3, 1),
(N'Phạm Thị PT2', '1992-11-25', 'F', '0904567890', 'pt2@gym.com', N'321 Võ Văn Tần, Q3, HCM', '2021-08-15', 3, 1),
(N'Hoàng Văn PT3', '1988-07-08', 'M', '0905678901', 'pt3@gym.com', N'654 Điện Biên Phủ, Q10, HCM', '2020-12-01', 3, 1),
(N'Ngô Thị Kế Toán', '1993-04-12', 'F', '0906789012', 'ketoan@gym.com', N'987 Cách Mạng Tháng 8, Q3, HCM', '2022-01-10', 4, 1);

--------------------------------------------------
-- HUAN LUYEN VIEN
--------------------------------------------------
INSERT INTO dbo.HuanLuyenVien (MaNhanVien, ChuyenMon, MoTa, MucLuongCoBan, TiLeHoaHongPT) VALUES 
(3, N'Gym, Bodybuilding', N'HLV chuyên về tăng cơ giảm mỡ, 5 năm kinh nghiệm', 15000000, 30),
(4, N'Yoga, Pilates', N'HLV Yoga chứng chỉ quốc tế RYT-200', 12000000, 25),
(5, N'Boxing, MMA', N'Cựu võ sĩ chuyên nghiệp, 10 năm kinh nghiệm', 18000000, 35);

--------------------------------------------------
-- THANH VIEN (HOI VIEN)
--------------------------------------------------
INSERT INTO dbo.ThanhVien (MaThe, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, NgayDangKy, TrangThai) VALUES 
(N'TV001', N'Nguyễn Văn An', '1995-03-15', 'M', '0911111111', 'an@email.com', N'111 Lý Tự Trọng, Q1, HCM', '2024-01-05', 1),
(N'TV002', N'Trần Thị Bình', '1998-07-22', 'F', '0922222222', 'binh@email.com', N'222 Pasteur, Q3, HCM', '2024-01-10', 1),
(N'TV003', N'Lê Văn Cường', '1990-11-08', 'M', '0933333333', 'cuong@email.com', N'333 Hai Bà Trưng, Q1, HCM', '2024-01-15', 1),
(N'TV004', N'Phạm Thị Dung', '1993-05-30', 'F', '0944444444', 'dung@email.com', N'444 Nguyễn Thị Minh Khai, Q3, HCM', '2024-02-01', 1),
(N'TV005', N'Hoàng Văn Em', '1988-09-12', 'M', '0955555555', 'em@email.com', N'555 Đinh Tiên Hoàng, Bình Thạnh, HCM', '2024-02-10', 1),
(N'TV006', N'Vũ Thị Phương', '1996-12-25', 'F', '0966666666', 'phuong@email.com', N'666 Xô Viết Nghệ Tĩnh, Bình Thạnh, HCM', '2024-02-15', 1),
(N'TV007', N'Đặng Văn Giang', '1991-02-18', 'M', '0977777777', 'giang@email.com', N'777 Cộng Hòa, Tân Bình, HCM', '2024-03-01', 1),
(N'TV008', N'Bùi Thị Hoa', '1997-06-05', 'F', '0988888888', 'hoa@email.com', N'888 Trường Chinh, Tân Phú, HCM', '2024-03-10', 1);

--------------------------------------------------
-- TAI KHOAN
--------------------------------------------------
INSERT INTO dbo.TaiKhoan (TenDangNhap, MatKhauHash, MaVaiTro, MaNhanVien, MaThanhVien, TrangThai) VALUES 
(N'admin', N'$2a$11$hashedpassword123', 1, 1, NULL, 1),
(N'pt1', N'$2a$11$hashedpassword456', 2, 3, NULL, 1),
(N'pt2', N'$2a$11$hashedpassword789', 2, 4, NULL, 1),
(N'pt3', N'$2a$11$hashedpassword012', 2, 5, NULL, 1),
(N'member1', N'$2a$11$hashedpassword111', 3, NULL, 1, 1),
(N'member2', N'$2a$11$hashedpassword222', 3, NULL, 2, 1),
(N'member3', N'$2a$11$hashedpassword333', 3, NULL, 3, 1);

--------------------------------------------------
-- DANG KY GOI TAP
--------------------------------------------------
INSERT INTO dbo.DangKyGoiTap (MaThanhVien, MaGoiTap, NgayDangKy, NgayBatDau, NgayKetThuc, SoLanTapConLai, TongTien, GhiChu, TrangThai) VALUES 
(1, 3, '2024-01-05', '2024-01-05', '2024-07-05', 50, 2000000, N'Đăng ký gói 6 tháng', 1),
(2, 4, '2024-01-10', '2024-01-10', '2025-01-10', 100, 3500000, N'Đăng ký gói VIP 1 năm', 1),
(3, 2, '2024-01-15', '2024-01-15', '2024-04-15', 30, 1200000, N'Đăng ký gói 3 tháng', 1),
(4, 3, '2024-02-01', '2024-02-01', '2024-08-01', 50, 2000000, N'Đăng ký gói 6 tháng', 1),
(5, 4, '2024-02-10', '2024-02-10', '2025-02-10', 100, 3500000, N'Đăng ký gói VIP', 1),
(6, 1, '2024-02-15', '2024-02-15', '2024-03-15', 15, 500000, N'Đăng ký gói 1 tháng', 1),
(7, 2, '2024-03-01', '2024-03-01', '2024-06-01', 30, 1200000, N'Đăng ký gói 3 tháng', 1),
(8, 3, '2024-03-10', '2024-03-10', '2024-09-10', 50, 2000000, N'Đăng ký gói 6 tháng', 1);

--------------------------------------------------
-- HOP DONG PT
--------------------------------------------------
INSERT INTO dbo.HopDongPT (MaThanhVien, MaHuanLuyenVien, MaGoiPT, NgayBatDau, NgayKetThuc, SoBuoiConLai, TongTien, GhiChu, TrangThai) VALUES 
(1, 1, 2, '2024-01-10', '2024-04-10', 15, 3500000, N'Hợp đồng PT 20 buổi', 1),
(2, 2, 1, '2024-01-15', '2024-03-15', 8, 2000000, N'Hợp đồng PT 10 buổi', 1),
(3, 1, 3, '2024-02-01', '2024-06-01', 25, 4500000, N'Hợp đồng PT 30 buổi', 1),
(4, 2, 2, '2024-02-10', '2024-05-10', 18, 3500000, N'Hợp đồng PT 20 buổi', 1),
(5, 3, 1, '2024-02-20', '2024-04-20', 6, 2000000, N'Hợp đồng PT Boxing', 1),
(7, 1, 2, '2024-03-05', '2024-06-05', 20, 3500000, N'Hợp đồng PT 20 buổi', 1);

--------------------------------------------------
-- BUOI TAP PT
--------------------------------------------------
INSERT INTO dbo.BuoiTapPT (MaHopDongPT, ThoiGianBatDau, ThoiGianKetThuc, TrangThai, GhiChu) VALUES 
(1, '2024-01-10 08:00:00', '2024-01-10 09:30:00', 2, N'Buổi đầu tiên - đánh giá thể lực'),
(1, '2024-01-12 08:00:00', '2024-01-12 09:30:00', 2, N'Tập ngực và vai'),
(1, '2024-01-15 08:00:00', '2024-01-15 09:30:00', 2, N'Tập lưng và tay sau'),
(1, '2024-01-17 08:00:00', '2024-01-17 09:30:00', 2, N'Tập chân'),
(1, '2024-01-19 08:00:00', '2024-01-19 09:30:00', 2, N'Tập bụng và cardio'),
(2, '2024-01-15 17:00:00', '2024-01-15 18:00:00', 2, N'Yoga cơ bản'),
(2, '2024-01-17 17:00:00', '2024-01-17 18:00:00', 2, N'Yoga giãn cơ'),
(3, '2024-02-01 09:00:00', '2024-02-01 10:30:00', 2, N'Đánh giá và lên kế hoạch'),
(3, '2024-02-03 09:00:00', '2024-02-03 10:30:00', 2, N'Tập toàn thân'),
(4, '2024-02-10 18:00:00', '2024-02-10 19:00:00', 2, N'Pilates cơ bản'),
(5, '2024-02-20 07:00:00', '2024-02-20 08:30:00', 2, N'Boxing cơ bản'),
(5, '2024-02-22 07:00:00', '2024-02-22 08:30:00', 2, N'Kỹ thuật đấm'),
(6, '2024-03-05 10:00:00', '2024-03-05 11:30:00', 1, N'Buổi sắp tới');

--------------------------------------------------
-- DIEM DANH
--------------------------------------------------
INSERT INTO dbo.DiemDanh (MaThanhVien, ThoiGianVao, ThoiGianRa, HinhThuc) VALUES 
(1, '2024-01-10 07:45:00', '2024-01-10 10:00:00', N'Thẻ từ'),
(1, '2024-01-12 07:50:00', '2024-01-12 10:15:00', N'Thẻ từ'),
(2, '2024-01-15 16:45:00', '2024-01-15 18:30:00', N'Thẻ từ'),
(3, '2024-02-01 08:30:00', '2024-02-01 11:00:00', N'Vân tay'),
(4, '2024-02-10 17:30:00', '2024-02-10 19:30:00', N'Thẻ từ'),
(5, '2024-02-20 06:45:00', '2024-02-20 09:00:00', N'Vân tay'),
(6, '2024-02-15 18:00:00', '2024-02-15 19:30:00', N'Thẻ từ'),
(7, '2024-03-01 09:00:00', '2024-03-01 11:00:00', N'Thẻ từ'),
(8, '2024-03-10 17:00:00', '2024-03-10 19:00:00', N'Vân tay');

--------------------------------------------------
-- BUOI TAP (SESSIONS)
--------------------------------------------------
INSERT INTO dbo.BuoiTap (MaThanhVien, MaDangKy, NgayTap, ThoiGianBatDau, ThoiGianKetThuc) VALUES 
(1, 1, '2024-01-10', '2024-01-10 07:45:00', '2024-01-10 10:00:00'),
(1, 1, '2024-01-12', '2024-01-12 07:50:00', '2024-01-12 10:15:00'),
(2, 2, '2024-01-15', '2024-01-15 16:45:00', '2024-01-15 18:30:00'),
(3, 3, '2024-02-01', '2024-02-01 08:30:00', '2024-02-01 11:00:00'),
(4, 4, '2024-02-10', '2024-02-10 17:30:00', '2024-02-10 19:30:00'),
(5, 5, '2024-02-20', '2024-02-20 06:45:00', '2024-02-20 09:00:00');

--------------------------------------------------
-- HOA DON
--------------------------------------------------
INSERT INTO dbo.HoaDon (MaThanhVien, MaNhanVienLap, NgayLap, TongTien, GiamGia, SoTienPhaiTra, TrangThai) VALUES 
(1, 2, '2024-01-05 10:00:00', 5500000, 500000, 5000000, 1),
(2, 2, '2024-01-10 14:30:00', 5500000, 500000, 5000000, 1),
(3, 2, '2024-01-15 09:00:00', 5700000, 500000, 5200000, 1),
(4, 2, '2024-02-01 11:00:00', 5500000, 300000, 5200000, 1),
(5, 2, '2024-02-10 15:00:00', 5500000, 350000, 5150000, 1),
(6, 2, '2024-02-15 16:00:00', 500000, 0, 500000, 1),
(7, 2, '2024-03-01 10:30:00', 4700000, 120000, 4580000, 1),
(8, 2, '2024-03-10 14:00:00', 2000000, 0, 2000000, 1);

--------------------------------------------------
-- CHI TIET HOA DON
--------------------------------------------------
INSERT INTO dbo.ChiTietHoaDon (MaHoaDon, LoaiSanPham, MaThamChieu, SoLuong, DonGia, ThanhTien) VALUES 
(1, N'GoiTap', 3, 1, 2000000, 2000000),
(1, N'GoiPT', 2, 1, 3500000, 3500000),
(2, N'GoiTap', 4, 1, 3500000, 3500000),
(2, N'GoiPT', 1, 1, 2000000, 2000000),
(3, N'GoiTap', 2, 1, 1200000, 1200000),
(3, N'GoiPT', 3, 1, 4500000, 4500000),
(4, N'GoiTap', 3, 1, 2000000, 2000000),
(4, N'GoiPT', 2, 1, 3500000, 3500000),
(5, N'GoiTap', 4, 1, 3500000, 3500000),
(5, N'GoiPT', 1, 1, 2000000, 2000000),
(6, N'GoiTap', 1, 1, 500000, 500000),
(7, N'GoiTap', 2, 1, 1200000, 1200000),
(7, N'GoiPT', 2, 1, 3500000, 3500000),
(8, N'GoiTap', 3, 1, 2000000, 2000000);

--------------------------------------------------
-- THANH TOAN
--------------------------------------------------
INSERT INTO dbo.ThanhToan (MaHoaDon, SoTien, NgayThanhToan, HinhThuc) VALUES 
(1, 5000000, '2024-01-05 10:15:00', N'Chuyển khoản'),
(2, 5000000, '2024-01-10 14:45:00', N'Tiền mặt'),
(3, 5200000, '2024-01-15 09:15:00', N'Thẻ tín dụng'),
(4, 5200000, '2024-02-01 11:20:00', N'Chuyển khoản'),
(5, 5150000, '2024-02-10 15:30:00', N'Tiền mặt'),
(6, 500000, '2024-02-15 16:10:00', N'Tiền mặt'),
(7, 4580000, '2024-03-01 10:45:00', N'Chuyển khoản'),
(8, 2000000, '2024-03-10 14:15:00', N'Thẻ tín dụng');

--------------------------------------------------
-- THONG BAO
--------------------------------------------------
INSERT INTO dbo.ThongBao (MaThanhVien, TieuDe, NoiDung, LoaiThongBao, NgayGui, DaDoc, TrangThai) VALUES 
(1, N'Chào mừng đến với Gym!', N'Chào mừng bạn đã đăng ký thành viên. Chúc bạn tập luyện hiệu quả!', N'ChaoMung', '2024-01-05 10:30:00', 1, 1),
(1, N'Nhắc lịch tập PT', N'Bạn có buổi tập PT vào ngày mai lúc 8:00 sáng với HLV Lê Văn PT1', N'NhacLich', '2024-01-09 18:00:00', 1, 1),
(2, N'Chào mừng đến với Gym!', N'Chào mừng bạn đã đăng ký thành viên. Chúc bạn tập luyện hiệu quả!', N'ChaoMung', '2024-01-10 15:00:00', 1, 1),
(3, N'Gói tập sắp hết hạn', N'Gói tập của bạn sẽ hết hạn vào ngày 15/04/2024. Hãy gia hạn để tiếp tục tập luyện!', N'NhacHan', '2024-04-01 09:00:00', 0, 1),
(4, N'Khuyến mãi tháng 3', N'Giảm 20% khi gia hạn gói tập trong tháng 3!', N'KhuyenMai', '2024-03-01 08:00:00', 0, 1),
(5, N'Nhắc lịch tập PT', N'Bạn có buổi tập Boxing vào ngày mai lúc 7:00 sáng', N'NhacLich', '2024-02-21 18:00:00', 1, 1),
(NULL, N'Thông báo bảo trì', N'Phòng tập sẽ bảo trì thiết bị vào Chủ nhật 10/03/2024', N'ThongBaoChung', '2024-03-08 10:00:00', 0, 1),
(NULL, N'Lịch nghỉ Tết', N'Phòng tập nghỉ Tết từ 28/01 đến 02/02/2024', N'ThongBaoChung', '2024-01-20 09:00:00', 0, 1);

--------------------------------------------------
-- LICH SU THAY DOI GOI
--------------------------------------------------
INSERT INTO dbo.LichSuThayDoiGoi (MaDangKy, LoaiThayDoi, NoiDungCu, NoiDungMoi, MaNguoiThayDoi, GhiChu) VALUES 
(2, N'GiaHan', N'NgayKetThuc: 2024-07-10', N'NgayKetThuc: 2025-01-10', 1, N'Gia hạn thêm 6 tháng'),
(5, N'NangCap', N'GoiTap: Gói 3 tháng', N'GoiTap: Gói 12 tháng', 1, N'Nâng cấp lên gói VIP');

PRINT N'Đã thêm dữ liệu mẫu thành công!';
GO
