#!/bin/bash
set -e
storepass=$1
if [ -z "$storepass" ]; then
   echo "Please input storepass"
   exit 1
fi

test -z $ANDROID_HOME && ANDROID_HOME=~/Software/android-sdk

current_dir=$(cd `dirname $0`;pwd)
cd $current_dir
# build android
ionic cordova build android --prod --release

app_name="com.nxest.littlejellybean"
key_alias=$app_name
keystore_name=$app_name.keystore

# remove old keystore file
rm -rf $keystore_name

# generator keystore
keytool -genkey  \
        -keystore $keystore_name \
        -alias $key_alias \
        -keypass $storepass \
        -storepass $storepass  \
        -keyalg RSA \
        -keysize 2048 \
        -validity 100000 \
        -dname CN=l10178,OU=com.nxest,O=com.nxest,L=bj,ST=bj,C=cn

unsigned_apk="$current_dir/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
release_apk="$current_dir/$app_name.apk"

rm -rf $signed_apk $release_apk
# zipalign
$ANDROID_HOME/build-tools/27.0.0/zipalign -v 4 $unsigned_apk $release_apk
# sign
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $keystore_name -storepass $storepass $release_apk $key_alias
