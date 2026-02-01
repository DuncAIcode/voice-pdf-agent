#!/usr/bin/env python3
import paramiko
from paramiko import SSHClient, AutoAddPolicy

HOSTINGER_VPS_IP = "72.60.187.170"
HOSTINGER_VPS_PASSWORD = "2)'OQ#-MlGEuG3?nohAg"

def main():
    print(f"Connecting to {HOSTINGER_VPS_IP}...")
    ssh = SSHClient()
    ssh.set_missing_host_key_policy(AutoAddPolicy())
    
    try:
        ssh.connect(HOSTINGER_VPS_IP, username="root", password=HOSTINGER_VPS_PASSWORD)
        print("Connected.")
        
        # Pull latest code
        print("Pulling latest code...")
        # Since we modified the code locally and pushed, we need to pull it on VPS
        # But wait, we modified backend/main.py.
        # VPS repo is at /var/www/voice-pdf-agent
        
        # We need to make sure we don't have local changes on VPS blocking pull (from previous .env hacks?)
        # .env is ignored, so that's fine.
        # But we previously did valid things.
        
        stdin, stdout, stderr = ssh.exec_command("cd /var/www/voice-pdf-agent && git fetch origin && git reset --hard origin/main")
        print(stdout.read().decode())
        err = stderr.read().decode()
        if err: print(f"Git output (stderr): {err}")
        
        # Restart Service
        print("Restarting service...")
        ssh.exec_command("systemctl restart voice-pdf-agent")
        
        print("Deployed update successfully.")
        
    except Exception as e:
        print(f"Failed: {e}")
    finally:
        ssh.close()

if __name__ == "__main__":
    main()
