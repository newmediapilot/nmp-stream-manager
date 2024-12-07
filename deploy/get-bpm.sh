# Create a directory named "bin" if it doesn't already exist
mkdir ./bin 2>nul

# Download the file "hds_desktop_windows.exe" from the specified URL using curl
curl -L -o ./.bin/hds_desktop_windows.exe https://github.com/Rexios80/hds_desktop/releases/download/0.2.3/hds_desktop_windows.exe