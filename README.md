
# voltronic-P30_exporter

## Service Configuration

```sh
sudo nano /lib/systemd/system/voltronic.service
```

```ini
[Unit]
Description=voltronic-P30_exporter - A prometheus exporter for Voltronic P30 MPPT solar inverters.
After=network.target

[Service]
Environment=NODE_ENV='production'
User=rami
ExecStart=/bin/env node .
WorkingDirectory=/home/rami/Services/voltronic-p30_exporter/
RestartSec=30
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
