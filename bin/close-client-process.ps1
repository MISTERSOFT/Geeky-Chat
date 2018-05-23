# Powershell script #
#
# Usage:
# This script is used to close the client project process if it still running

Stop-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess -Force
