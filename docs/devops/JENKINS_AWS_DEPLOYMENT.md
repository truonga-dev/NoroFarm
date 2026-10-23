# Hướng Dẫn CI/CD Với Jenkins & Triển Khai Lên AWS (Backend & Frontend)

Tài liệu này cung cấp hướng dẫn đầy đủ từ chuẩn bị Docker container, cài đặt cấu hình Jenkins Pipeline tự động hóa CI/CD, đến các bước triển khai chi tiết lên hạ tầng AWS cho hệ sinh thái **NoroFarm**.

---

## 1. Cấu Trúc Đóng Gói Docker Container

Dự án NoroFarm được tối ưu hóa với mô hình Container hóa hoàn chỉnh:

| Thành phần | Dockerfile / Image | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| **Frontend** | `frontend/Dockerfile` | Next.js 15 Standalone mode, Node 20 Alpine đa tầng (Multi-stage), dung lượng ~120MB, chạy bằng user bảo mật `nextjs` (UID 1001), tích hợp Healthcheck. |
| **Backend** | `backend/Dockerfile` | Python 3.13-slim đa tầng, loại bỏ trình biên dịch gcc thừa ở runtime, chạy bằng user unprivileged `appuser` (UID 1001), Uvicorn ASGI Server, tích hợp Healthcheck qua urllib. |
| **Gateway Proxy** | `nginx:alpine` | Reverse proxy xử lý SSL/TLS, định tuyến `/api/` về Backend, `/` về Frontend, nén Gzip, rate limit chống DDoS, WebSockets proxying cho HMR và live data. |
| **In-Memory Cache**| `redis:7-alpine` | Quản lý session, distributed rate limiting, cache dữ liệu thị trường và lịch đồng bộ Crawler. |

---

## 2. Hướng Dẫn Cấu Hình Jenkins CI/CD Pipeline

### 2.1. Yêu Cầu Cài Đặt Trên Máy Chủ Jenkins
- Máy chủ Jenkins (Ubuntu 22.04 LTS / Amazon Linux 2023, tối thiểu 2 vCPU, 4GB RAM).
- Đã cài đặt Docker, Docker Compose và AWS CLI v2 trên máy chủ Jenkins.
- Người dùng `jenkins` đã được thêm vào nhóm `docker`:
  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```

### 2.2. Các Plugin Jenkins Cần Thiết
Vào **Manage Jenkins** -> **Plugins** -> **Available Plugins** và cài đặt:
1. **Pipeline** (workflow-aggregator)
2. **Git Plugin**
3. **Docker Pipeline** & **Docker plugin**
4. **AWS Steps** / **Amazon Web Services Credentials Binding**
5. **SSH Agent Plugin** (Dùng cho SSH deploy lên EC2)
6. **AnsiColor** (Hiển thị log màu trong console)
7. **Credentials Binding Plugin**

### 2.3. Thiết Lập Credentials Trong Jenkins
Vào **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials (unrestricted)** -> **Add Credentials**:

| Credential ID | Kiểu (Kind) | Nội dung / Mô tả |
| :--- | :--- | :--- |
| `AWS_ACCOUNT_ID` | Secret text | Mã số tài khoản AWS 12 chữ số (ví dụ: `123456789012`) |
| `aws-ecr-credentials` | AWS Credentials | AWS Access Key ID & AWS Secret Access Key có quyền ECR |
| `EC2_PRODUCTION_IP` | Secret text | Địa chỉ IP Public / Elastic IP của máy chủ EC2 Production |
| `ec2-ssh-key` | SSH Username with private key | Username: `ubuntu`, Private Key: File `.pem` của EC2 Key Pair |

### 2.4. Khởi Tạo Pipeline Job Trên Jenkins
1. Chọn **New Item** -> Đặt tên: `NoroFarm-Production-Pipeline` -> Chọn **Pipeline** -> **OK**.
2. Phần **Build Triggers**: Tích chọn **GitHub hook trigger for GITScm polling** (hoặc GitLab webhook).
3. Phần **Pipeline**:
   - **Definition**: *Pipeline script from SCM*
   - **SCM**: *Git*
   - **Repository URL**: `https://github.com/truonga-dev/NoroFarm.git`
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`
4. Bấm **Save**.

### 2.5. Các Giai Đoạn Thực Thi Của Jenkinsfile
1. **Checkout Code**: Kéo mã nguồn mới nhất từ GitHub.
2. **Code Quality & Linting**: Chạy song song kiểm tra mã nguồn (Ruff cho Python Backend, ESLint cho Next.js Frontend).
3. **Automated Tests**: Khởi chạy container tạm thời để chạy bộ test Pytest.
4. **Docker Build Images**: Đóng gói Frontend và Backend với tag chứa số Build và Git Commit SHA.
5. **Security Vulnerability Scan**: Sử dụng `aquasec/trivy` quét mã độc và lỗ hổng thư viện trong Docker images.
6. **Push Images to AWS ECR**: Đăng nhập AWS ECR và đẩy image lên kho lưu trữ đám mây.
7. **Deploy to AWS Server**: Kết nối SSH tới máy chủ EC2, tải bản image mới và khởi động bằng `docker compose -f docker-compose.prod.yml up -d`.
8. **Healthcheck & Smoke Tests**: Gọi kiểm tra Endpoint `/api/v1/health` để đảm bảo hệ thống phản hồi HTTP 200 trước khi đánh dấu thành công.

---

## 3. Hướng Dẫn Triển Khai Lên AWS (Backend & Frontend)

### Phương Án A: Triển Khai Trên AWS EC2 + Docker Compose (Khuyên dùng cho Startup, chi phí $15 - $40/tháng)

#### Bước 1: Khởi Tạo Amazon ECR (Elastic Container Registry)
Tạo 2 repository riêng biệt trên AWS ECR để chứa Docker image:
```bash
aws ecr create-repository --repository-name norofarm-backend --region ap-southeast-1
aws ecr create-repository --repository-name norofarm-frontend --region ap-southeast-1
```

#### Bước 2: Khởi Tạo Máy Chủ AWS EC2
1. **AMI**: Ubuntu Server 24.04 LTS (HVM), SSD Volume Type.
2. **Instance Type**: `t3.small` (2GB RAM, có thể kích hoạt 2GB Swap) hoặc `t3.medium` (4GB RAM) cho hiệu năng tốt nhất.
3. **Storage**: 30GB gp3 SSD.
4. **Security Group (Tường lửa)**:
   - Port 22 (SSH): Chỉ mở cho IP của bạn hoặc máy chủ Jenkins.
   - Port 80 (HTTP): Mở công khai `0.0.0.0/0`.
   - Port 443 (HTTPS): Mở công khai `0.0.0.0/0`.
5. Gắn **Elastic IP** cố định vào máy chủ EC2 để tránh đổi IP khi reboot.

#### Bước 3: Cài Đặt Môi Trường Trên Máy Chủ EC2
SSH vào máy chủ EC2:
```bash
ssh -i "norofarm-key.pem" ubuntu@<EC2_PUBLIC_IP>
```
Chạy script cài đặt Docker, Docker Compose & AWS CLI:
```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin awscli

sudo usermod -aG docker ubuntu
sudo mkdir -p /opt/norofarm /opt/norofarm/nginx
sudo chown -R ubuntu:ubuntu /opt/norofarm
```

#### Bước 4: Chuẩn Bị Thư Mục Và Cấu Hình Production
Trên máy chủ EC2 trong thư mục `/opt/norofarm`:
1. Tạo file `.env.production` từ mẫu `.env.production.example`.
2. Sao chép file `docker-compose.prod.yml` và file cấu hình `nginx/nginx.conf`.
3. Cấp quyền phân vùng uploads:
   ```bash
   sudo mkdir -p /opt/norofarm/uploads
   sudo chown -R 1001:1001 /opt/norofarm/uploads
   ```

#### Bước 5: Cấu Hình Tên Miền (DNS) & Cấp Chứng Chỉ SSL (HTTPS) Miễn Phí
1. Trỏ DNS Domain trên Cloudflare hoặc AWS Route 53:
   - `norofarm.com` -> `A Record` -> `EC2_ELASTIC_IP`
   - `www.norofarm.com` -> `CNAME` -> `norofarm.com`
   - `api.norofarm.com` -> `A Record` -> `EC2_ELASTIC_IP`
2. Sử dụng Certbot cấp phát chứng chỉ SSL Let's Encrypt:
   ```bash
   sudo apt-get install -y certbot
   sudo certbot certonly --standalone -d norofarm.com -d www.norofarm.com -d api.norofarm.com --email admin@norofarm.com --agree-tos --non-interactive
   ```
3. Sau khi có chứng chỉ trong `/etc/letsencrypt/live/norofarm.com/`, kích hoạt SSL trong Nginx và tự động gia hạn với crontab.

---

### Phương Án B: Triển Khai Doanh Nghiệp Trên AWS ECS Fargate + CloudFront (Autoscaling)

Đối với mô hình chịu tải lớn và mở rộng tự động:
1. **Frontend**: Có thể triển khai trên **AWS Amplify Hosting** (tối ưu hóa cho Next.js SSR) hoặc **AWS ECS Fargate Task** kết hợp **CloudFront CDN** phân phối toàn cầu.
2. **Backend**: Triển khai dạng **AWS ECS Fargate Service** chạy sau **Application Load Balancer (ALB)**.
   - ALB gắn SSL Certificate từ AWS Certificate Manager (ACM) hoàn toàn miễn phí.
   - Target Group tự động kiểm tra sức khỏe qua endpoint `/api/v1/health`.
   - Cấu hình Auto Scaling Policy: Tự động tăng số lượng container khi CPU đạt > 70%.
3. **Database**: Kết nối với **Supabase Managed Postgres** (hoặc AWS RDS Aurora PostgreSQL) thông qua Session Pooling.
4. **Cache**: Sử dụng **AWS ElastiCache for Redis** (Cluster mode enabled).
