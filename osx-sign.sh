#export
CODESIGN_ALLOCATE="/Applications/Xcode.app/Contents/Developer/usr/bin/codesign_allocate"
#Run the following to get a list of certs
#
#security find-identity
app="$1"
identity="04CA9D638B6139B128A0336F3FC158E498C2CABA"

echo "### signing frameworks"
codesign --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/crash_inspector"
codesign --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/node-webkit Framework.framework/node-webkit Framework.tmp"
codesign --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/node-webkit Framework.framework/node-webkit Framework.TOC"
codesign --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/node-webkit Framework.framework/"
codesign --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/node-webkit Helper EH.app/"
codesign --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/node-webkit Helper NP.app/"
codesign --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/node-webkit Helper.app/"

echo "### signing app"
codesign --force --verify --verbose --sign "$identity" "$app"

echo "### verifying signature"
codesign -vvv -d "$app"
sudo spctl -a -vvvv "$app"
