Cài đặt PostgreSQL bằng Docker
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres
ip = 192.168.23.5
Lấy địa chỉ IP container:
docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" postgres

docker exec -it postgres bash
psql -U postgres

docker-compose up -d

Status code quy ước:

200 : GET thành công
201 : POST thành công (tạo mới)
202 : PUT thành công (update)
204 : DELETE thành công (không trả data)
400 : Kiem tra ton tai hay chua
404 : Không tìm thấy
500 : Lỗi server