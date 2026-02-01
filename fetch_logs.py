import paramiko
import os

HOSTINGER_VPS_IP = "72.60.187.170"
HOSTINGER_VPS_PASSWORD = "2)'OQ#-MlGEuG3?nohAg"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOSTINGER_VPS_IP, username="root", password=HOSTINGER_VPS_PASSWORD)

stdin, stdout, stderr = ssh.exec_command("journalctl -u voice-pdf-agent -n 100 --no-pager")
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
