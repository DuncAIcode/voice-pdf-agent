import paramiko
import os
import time

# Credentials
HOSTINGER_IP = "72.60.187.170"
HOSTINGER_USER = "root"
HOSTINGER_PASSWORD = "2)'OQ#-MlGEuG3?nohAg"

# Vercel URLs to add
VERCEL_URLS = [
    "https://voice-pdf-agent.vercel.app",
    "https://frontend-beta-bay-hra8pgdkq5.vercel.app",
    "https://frontend-aulswfarf-duncans-projects-eb8b9d58.vercel.app"
]

def update_cors():
    print(f"Connecting to {HOSTINGER_IP}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOSTINGER_IP, username=HOSTINGER_USER, password=HOSTINGER_PASSWORD)
        print("✅ Connected!")
        
        # 1. Read current main.py
        print("Reading main.py...")
        stdin, stdout, stderr = ssh.exec_command("cat /var/www/voice-pdf-agent/backend/main.py")
        current_content = stdout.read().decode()
        
        if not current_content:
            print("❌ Could not read main.py")
            return

        # 2. Prepare new content
        # We'll look for the origins list and replace it
        # This is a bit detailed search & replace to be safe
        
        new_origins_str = 'origins = [\n    "http://localhost:3000",\n'
        for url in VERCEL_URLS:
            new_origins_str += f'    "{url}",\n'
        new_origins_str += ']'
        
        # Use regex or simple string replacement if the structure is known
        # Based on previous view of main.py, it's inside main.py
        
        if "origins = [" in current_content:
            import re
            # Regex to replace the entire origins list
            # origins = [ ... ]
            pattern = r"origins = \[\s*.*?\s*\]"
            new_content = re.sub(pattern, new_origins_str, current_content, flags=re.DOTALL)
            
            print("Writing updated main.py...")
            
            # Write to a temp file first
            sftp = ssh.open_sftp()
            with sftp.file("/tmp/main_new.py", "w") as f:
                f.write(new_content)
            
            # Move it to actual location
            ssh.exec_command("mv /tmp/main_new.py /var/www/voice-pdf-agent/backend/main.py")
            print("✅ main.py updated")
            
            # 3. Restart Service
            print("Restarting service...")
            stdin, stdout, stderr = ssh.exec_command("systemctl restart voice-pdf-agent")
            exit_status = stdout.channel.recv_exit_status()
            
            if exit_status == 0:
                print("✅ Service restarted successfully")
            else:
                print(f"❌ Service restart failed: {stderr.read().decode()}")

        else:
            print("❌ Could not find 'origins = [' in main.py")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        ssh.close()

if __name__ == "__main__":
    update_cors()
