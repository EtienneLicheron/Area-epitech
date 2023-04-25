#!/bin/bash

# Go to working directory
cd /usr/src/app
echo "Working directory: $(pwd)"

# Check if .apk file already exists
existing_apk_file=$(find . -name "*.apk")
if [ $existing_apk_file ]; then
    echo "Android: APK file already exists: $existing_apk_file"
    cp $existing_apk_file /var/client-data/client.apk
    if [ $? -ne 0 ]; then
        echo "Android: APK file copy failed - stopping"
        exit 1
    fi
    echo "APK file copied to /var/client-data/client.apk"
    echo "Done."
    exit 0
fi
if [ -f /var/client-data/client.apk ]; then
    echo "Android: APK file already exists: /var/client-data/client.apk"
    echo "Done."
    exit 0
fi

# Build APK with Gradle
cd android
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    echo "Gradle build failed - stopping"
    exit 1
fi
echo "Gradle build successful"

# Get the .apk file
apk_file=$(find . -name "*.apk")
if [ $? -ne 0 ]; then
    echo "Android: APK file not found - stopping"
    exit 1
fi
echo "APK file found: $apk_file"

# Copy .apk file to /var/client-data/ to serve it
cp $apk_file /var/client-data/client.apk
if [ $? -ne 0 ]; then
    echo "Android: APK file copy failed - stopping"
    exit 1
fi
echo "APK file copied to /var/client-data/client.apk"
echo "Done."

# Run the command passed to the container
exec "$@"
