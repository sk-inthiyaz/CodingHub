Quick health check

# WSL health
wsl --status
wsl -l -v

# Docker engine & CLI
docker version
docker info

If docker info fails, Docker Desktop likely isn’t running yet.

Start/stop Docker Desktop

# Start Docker Desktop (if closed)
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Optional: check process is up
Get-Process "Docker Desktop" -ErrorAction SilentlyContinue

# Stop Docker Desktop (force)
Get-Process "Docker Desktop" -ErrorAction SilentlyContinue | Stop-Process -Force

Tip: In Docker Desktop Settings, enable “Start Docker Desktop when you log in” for a more “permanent” fix.

# Stop all WSL distros
wsl --shutdown

# Update WSL (optional)
wsl --update

After shutdown, start Docker Desktop again.

Verify/pull required images upfront

docker pull node:20-alpine
docker pull python:3.11-alpine
docker pull openjdk:17-alpine
docker pull gcc:latest

Sanity test containers
# Python
docker run --rm -i python:3.11-alpine python -c "print('ok')"

# Node
docker run --rm -i node:20-alpine node -e "console.log('ok')"

# Java
docker run --rm -i openjdk:17-alpine java -version

# C++ (gcc)
docker run --rm -i gcc:latest sh -lc "echo '#include <iostream>\nint main(){std::cout<<\"ok\";}' > a.cpp && g++ a.cpp -o a.out && ./a.out"


See what’s running/stopped

# Running containers
docker ps

# All containers (including exited)
docker ps -a

# Images present
docker images


Cleanup (when stuck)
Use with care—these remove old containers/images.
# Remove all stopped containers
docker ps -aq | ForEach-Object { docker rm -f $_ }

# Prune unused images, containers, networks, and build cache
docker system prune -af --volumes



//Test:
PS C:\Windows\System32> wsl --shutdown
>>
PS C:\Windows\System32> docker version
>>
Client:
 Version:           28.5.1
 API version:       1.51
 Go version:        go1.24.8
 Git commit:        e180ab8
 Built:             Wed Oct  8 12:19:16 2025
 OS/Arch:           windows/amd64
 Context:           desktop-linux

Server: Docker Desktop 4.48.0 (207573)
 Engine:
  Version:          28.5.1
  API version:      1.51 (minimum version 1.24)
  Go version:       go1.24.8
  Git commit:       f8215cc
  Built:            Wed Oct  8 12:17:24 2025
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.7.27
  GitCommit:        05044ec0a9a75232cad458027ca83437aae3f4da
 runc:
  Version:          1.2.5
  GitCommit:        v1.2.5-0-g59923ef
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
PS C:\Windows\System32> docker run --rm -i python:3.11-alpine python -c "print('ok')"
>>
ok