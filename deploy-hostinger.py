#!/usr/bin/env python3
"""
Hostinger VPS Automated Deployment Script
Deploys the FastAPI backend to Hostinger VPS with full automation
"""

import os
import sys
import time
from typing import Optional

try:
    import paramiko
    from paramiko import SSHClient, AutoAddPolicy
except ImportError:
    print("❌ Missing dependencies. Installing...")
    os.system("pip install paramiko")
    import paramiko
    from paramiko import SSHClient, AutoAddPolicy

# Configuration from environment variables
HOSTINGER_API_TOKEN = os.getenv("HOSTINGER_API_TOKEN")
HOSTINGER_VPS_IP = os.getenv("HOSTINGER_VPS_IP")
HOSTINGER_VPS_PASSWORD = os.getenv("HOSTINGER_VPS_PASSWORD", "")
GITHUB_REPO = "https://github.com/DuncAIcode/voice-pdf-agent.git"

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def print_step(step: str, status: str = "🔄"):
    """Print formatted step message"""
    print(f"\n{status} {step}")


def run_ssh_command(ssh: SSHClient, command: str, show_output: bool = True) -> tuple:
    """Execute SSH command and return output"""
    stdin, stdout, stderr = ssh.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()
    
    output = stdout.read().decode()
    error = stderr.read().decode()
    
    if show_output and output:
        print(output)
    if error and exit_status != 0:
        print(f"⚠️  {error}")
    
    return exit_status, output, error


def validate_environment():
    """Validate required environment variables"""
    print_step("Validating environment variables...", "🔍")
    
    missing = []
    if not HOSTINGER_VPS_IP:
        missing.append("HOSTINGER_VPS_IP")
    if not SUPABASE_URL:
        missing.append("SUPABASE_URL")
    if not SUPABASE_KEY:
        missing.append("SUPABASE_KEY")
    if not GEMINI_API_KEY:
        missing.append("GEMINI_API_KEY")
    
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        print("\nPlease set them:")
        print("$env:HOSTINGER_VPS_IP=\"your-vps-ip\"")
        print("$env:HOSTINGER_VPS_PASSWORD=\"your-root-password\"")
        print("$env:SUPABASE_URL=\"your-supabase-url\"")
        print("$env:SUPABASE_KEY=\"your-supabase-key\"")
        print("$env:GEMINI_API_KEY=\"your-gemini-key\"")
        sys.exit(1)
    
    print("✅ All environment variables set")


def connect_ssh() -> SSHClient:
    """Connect to VPS via SSH"""
    print_step(f"Connecting to VPS at {HOSTINGER_VPS_IP}...", "🔌")
    
    ssh = SSHClient()
    ssh.set_missing_host_key_policy(AutoAddPolicy())
    
    try:
        if HOSTINGER_VPS_PASSWORD:
            ssh.connect(
                HOSTINGER_VPS_IP,
                username="root",
                password=HOSTINGER_VPS_PASSWORD,
                timeout=30
            )
        else:
            # Try key-based authentication
            ssh.connect(
                HOSTINGER_VPS_IP,
                username="root",
                timeout=30
            )
        
        print("✅ Connected to VPS")
        return ssh
    
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        print("\nMake sure:")
        print("1. VPS IP is correct")
        print("2. Root password is set (export HOSTINGER_VPS_PASSWORD=...)")
        print("3. SSH is enabled on your VPS")
        sys.exit(1)


def setup_system(ssh: SSHClient):
    """Update system and install required packages"""
    print_step("Updating system and installing dependencies...", "📦")
    
    commands = [
        "apt update -y",
        "DEBIAN_FRONTEND=noninteractive apt upgrade -y",
        "apt install -y python3 python3-pip python3-venv git nginx certbot python3-certbot-nginx curl",
    ]
    
    for cmd in commands:
        status, _, _ = run_ssh_command(ssh, cmd, show_output=False)
        if status != 0:
            print(f"⚠️  Warning: Command failed: {cmd}")
    
    print("✅ System updated and packages installed")


def clone_repository(ssh: SSHClient):
    """Clone GitHub repository"""
    print_step("Cloning GitHub repository...", "📥")
    
    # Remove old directory if exists
    run_ssh_command(ssh, "rm -rf /var/www/voice-pdf-agent", show_output=False)
    
    # Create directory and clone
    commands = [
        "mkdir -p /var/www",
        f"cd /var/www && git clone {GITHUB_REPO}",
    ]
    
    for cmd in commands:
        status, _, _ = run_ssh_command(ssh, cmd)
        if status != 0:
            print(f"❌ Failed to clone repository")
            sys.exit(1)
    
    print("✅ Repository cloned")


def setup_backend(ssh: SSHClient):
    """Set up Python backend"""
    print_step("Setting up Python backend...", "🐍")
    
    commands = [
        "cd /var/www/voice-pdf-agent/backend && python3 -m venv venv",
        "cd /var/www/voice-pdf-agent/backend && source venv/bin/activate && pip install --upgrade pip",
        "cd /var/www/voice-pdf-agent/backend && source venv/bin/activate && pip install -r requirements.txt",
    ]
    
    for cmd in commands:
        status, _, _ = run_ssh_command(ssh, cmd, show_output=False)
        if status != 0:
            print(f"❌ Failed to set up backend")
            sys.exit(1)
    
    print("✅ Backend dependencies installed")


def configure_environment(ssh: SSHClient):
    """Configure environment variables"""
    print_step("Configuring environment variables...", "⚙️")
    
    env_content = f"""SUPABASE_URL={SUPABASE_URL}
SUPABASE_KEY={SUPABASE_KEY}
GEMINI_API_KEY={GEMINI_API_KEY}
"""
    
    # Write .env file
    cmd = f'cat > /var/www/voice-pdf-agent/backend/.env << EOF\n{env_content}\nEOF'
    status, _, _ = run_ssh_command(ssh, cmd, show_output=False)
    
    if status == 0:
        print("✅ Environment variables configured")
    else:
        print("❌ Failed to configure environment variables")
        sys.exit(1)


def create_systemd_service(ssh: SSHClient):
    """Create systemd service for FastAPI"""
    print_step("Creating systemd service...", "🔧")
    
    service_content = """[Unit]
Description=Voice PDF Agent FastAPI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/voice-pdf-agent/backend
Environment="PATH=/var/www/voice-pdf-agent/backend/venv/bin"
ExecStart=/var/www/voice-pdf-agent/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
"""
    
    cmd = f'cat > /etc/systemd/system/voice-pdf-agent.service << EOF\n{service_content}\nEOF'
    run_ssh_command(ssh, cmd, show_output=False)
    
    # Enable and start service
    commands = [
        "systemctl daemon-reload",
        "systemctl enable voice-pdf-agent",
        "systemctl start voice-pdf-agent",
    ]
    
    for cmd in commands:
        run_ssh_command(ssh, cmd, show_output=False)
    
    # Check status
    status, output, _ = run_ssh_command(ssh, "systemctl is-active voice-pdf-agent", show_output=False)
    
    if "active" in output:
        print("✅ Backend service started successfully")
    else:
        print("⚠️  Backend service may not be running. Check logs with:")
        print("   ssh root@{} 'journalctl -u voice-pdf-agent -n 50'".format(HOSTINGER_VPS_IP))


def configure_nginx(ssh: SSHClient):
    """Configure nginx reverse proxy"""
    print_step("Configuring nginx...", "🌐")
    
    nginx_config = f"""server {{
    listen 80;
    server_name {HOSTINGER_VPS_IP};

    location / {{
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}
"""
    
    cmd = f'cat > /etc/nginx/sites-available/voice-pdf-agent << EOF\n{nginx_config}\nEOF'
    run_ssh_command(ssh, cmd, show_output=False)
    
    # Enable site and restart nginx
    commands = [
        "ln -sf /etc/nginx/sites-available/voice-pdf-agent /etc/nginx/sites-enabled/",
        "rm -f /etc/nginx/sites-enabled/default",
        "nginx -t",
        "systemctl restart nginx",
    ]
    
    for cmd in commands:
        run_ssh_command(ssh, cmd, show_output=False)
    
    print("✅ Nginx configured and restarted")


def configure_firewall(ssh: SSHClient):
    """Configure firewall rules"""
    print_step("Configuring firewall...", "🔒")
    
    commands = [
        "ufw --force enable",
        "ufw allow 22",
        "ufw allow 80",
        "ufw allow 443",
        "ufw allow 8000",
    ]
    
    for cmd in commands:
        run_ssh_command(ssh, cmd, show_output=False)
    
    print("✅ Firewall configured")


def print_summary():
    """Print deployment summary"""
    print("\n" + "=" * 60)
    print("🎉 DEPLOYMENT SUCCESSFUL!")
    print("=" * 60)
    print(f"\n🌐 Backend URL: http://{HOSTINGER_VPS_IP}")
    print(f"📊 API Docs: http://{HOSTINGER_VPS_IP}/docs")
    
    print("\n📋 Next Steps:")
    print("1. Update Vercel environment variable:")
    print(f"   NEXT_PUBLIC_API_URL=http://{HOSTINGER_VPS_IP}")
    print("\n2. Update backend CORS in main.py:")
    print("   Add your Vercel URL to allow_origins")
    print("\n3. Redeploy Vercel frontend:")
    print("   cd frontend && vercel --prod")
    
    print("\n🔧 Useful Commands:")
    print(f"   ssh root@{HOSTINGER_VPS_IP}")
    print("   sudo systemctl status voice-pdf-agent")
    print("   sudo journalctl -u voice-pdf-agent -f")
    
    print("\n" + "=" * 60)


def main():
    """Main deployment function"""
    print("🚀 Hostinger VPS Deployment Script")
    print("=" * 60)
    
    # Validate environment
    validate_environment()
    
    # Connect to VPS
    ssh = connect_ssh()
    
    try:
        # Run deployment steps
        setup_system(ssh)
        clone_repository(ssh)
        setup_backend(ssh)
        configure_environment(ssh)
        create_systemd_service(ssh)
        configure_nginx(ssh)
        configure_firewall(ssh)
        
        # Print summary
        print_summary()
        
    except Exception as e:
        print(f"\n❌ Deployment failed: {e}")
        sys.exit(1)
    
    finally:
        ssh.close()


if __name__ == "__main__":
    main()
