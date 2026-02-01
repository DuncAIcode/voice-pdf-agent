#!/usr/bin/env python3
import os
import sys
import paramiko
from paramiko import SSHClient, AutoAddPolicy

# Configuration
HOSTINGER_VPS_IP = "72.60.187.170"
HOSTINGER_VPS_PASSWORD = os.getenv("HOSTINGER_VPS_PASSWORD", "")

# Correct credentials from local backend/.env
SUPABASE_URL = "https://kqahqjedzmowvzjrzzvg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxYWhxamVkem1vd3Z6anJ6enZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTYxMjYsImV4cCI6MjA4NTMzMjEyNn0.vs5QLTpB70cgjc0Vih4c-ObMb_U_BE9gK7j99bHxpJA"
GEMINI_API_KEY = "AIzaSyCVPRF80EOpiG7-yTLxm7JcO_rcFQyVF8w"

def run_ssh_command(ssh, command):
    stdin, stdout, stderr = ssh.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()
    output = stdout.read().decode()
    error = stderr.read().decode()
    if output: print(output)
    if error: print(f"Error: {error}")
    return exit_status

def main():
    print(f"Connecting to {HOSTINGER_VPS_IP}...")
    ssh = SSHClient()
    ssh.set_missing_host_key_policy(AutoAddPolicy())
    
    try:
        ssh.connect(HOSTINGER_VPS_IP, username="root", password=HOSTINGER_VPS_PASSWORD)
        print("Connected.")
        
        # 1. Update .env file
        env_content = f"SUPABASE_URL={SUPABASE_URL}\nSUPABASE_KEY={SUPABASE_KEY}\nGEMINI_API_KEY={GEMINI_API_KEY}\n"
        print("Updating .env file...")
        cmd = f'cat > /var/www/voice-pdf-agent/backend/.env << EOF\n{env_content}\nEOF'
        run_ssh_command(ssh, cmd)
        
        # 2. Fix uploads directory permissions
        print("Fixing uploads directory permissions...")
        run_ssh_command(ssh, "mkdir -p /var/www/voice-pdf-agent/backend/uploads")
        run_ssh_command(ssh, "chmod 777 /var/www/voice-pdf-agent/backend/uploads")
        
        # 3. Restart Service
        print("Restarting service...")
        run_ssh_command(ssh, "systemctl restart voice-pdf-agent")
        
        print("Done! configuration updated and service restarted.")
        
    except Exception as e:
        print(f"Failed: {e}")
    finally:
        ssh.close()

if __name__ == "__main__":
    main()
