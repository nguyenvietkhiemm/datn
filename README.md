lay dia chi de ket noi den docker_postgre cmd
docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" docker_postgre

xu ly logic o service
nhay yeu cau va tra ve o controller
ip = 192.168.23.5
"POSTGRES_USER=admin",
"POSTGRES_PASSWORD=12345",
"POSTGRES_DB=my_data",