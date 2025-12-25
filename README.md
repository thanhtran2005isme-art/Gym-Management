# GymManagement API

Hệ thống quản lý phòng tập gym với kiến trúc microservices.

## Cấu trúc project

- **GymManagement.API.Admin** (Port 7002) - API quản trị
- **GymManagement.API.User** (Port 7001) - API cho hội viên
- **GymManagement.API.Trainer** (Port 7003) - API cho huấn luyện viên
- **GymManagement.API.Auth** (Port 7004) - API xác thực
- **GymManagement.API.Gateway** (Port 7000) - API Gateway
- **GymManagement.DbHelper** - Thư viện kết nối database

## Chạy project

```bash
dotnet run --project GymManagement.API.Admin
```

## Database

Chạy file `Gym.sql` để tạo database.
