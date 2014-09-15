<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>CFBundleDevelopmentRegion</key>
        <string>en</string>
        <key>CFBundleDisplayName</key>
        <string><%= pkg.appBuild.fullname %></string>
        <key>CFBundleDocumentTypes</key>
        <array>
                <dict>
                        <key>CFBundleTypeIconFile</key>
                        <string>gr.icns</string>
                        <key>CFBundleTypeName</key>
                        <string><%= pkg.appBuild.fullname %> App</string>
                        <key>CFBundleTypeRole</key>
                        <string>Viewer</string>
                        <key>LSHandlerRank</key>
                        <string>Owner</string>
                        <key>LSItemContentTypes</key>
                        <array>
                                <string>com.intel.nw.app</string>
                        </array>
                </dict>
                <dict>
                        <key>CFBundleTypeName</key>
                        <string>Folder</string>
                        <key>CFBundleTypeOSTypes</key>
                        <array>
                                <string>fold</string>
                        </array>
                        <key>CFBundleTypeRole</key>
                        <string>Viewer</string>
                        <key>LSHandlerRank</key>
                        <string>None</string>
                </dict>
        </array>
        <key>CFBundleExecutable</key>
        <string>node-webkit</string>
        <key>CFBundleIconFile</key>
        <string>gr.icns</string>
        <key>CFBundleIdentifier</key>
        <string>com.intel.nw</string>
        <key>CFBundleInfoDictionaryVersion</key>
        <string>6.0</string>
        <key>CFBundleName</key>
        <string><%= pkg.appBuild.fullname %></string>
        <key>CFBundlePackageType</key>
        <string>APPL</string>
        <key>CFBundleShortVersionString</key>
        <string><%= pkg.version %></string>
        <key>LSFileQuarantineEnabled</key>
        <true/>
        <key>LSMinimumSystemVersion</key>
        <string>10.6.0</string>
        <key>NSPrincipalClass</key>
        <string>NSApplication</string>
        <key>NSSupportsAutomaticGraphicsSwitching</key>
        <true/>
        <key>SCMRevision</key>
        <string>213023</string>
        <key>UTExportedTypeDeclarations</key>
        <array>
                <dict>
                        <key>UTTypeConformsTo</key>
                        <array>
                                <string>com.pkware.zip-archive</string>
                        </array>
                        <key>UTTypeDescription</key>
                        <string><%= pkg.description %></string>
                        <key>UTTypeIconFile</key>
                        <string>gr.icns</string>
                        <key>UTTypeIdentifier</key>
                        <string>com.intel.nw.app</string>
                        <key>UTTypeReferenceURL</key>
                        <string>https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps</string>
                        <key>UTTypeTagSpecification</key>
                        <dict>
                                <key>com.apple.ostype</key>
                                <string><%= pkg.appBuild.fullname %></string>
                                <key>public.filename-extension</key>
                                <array>
                                        <string>nw</string>
                                </array>
                                <key>public.mime-type</key>
                                <string>application/x-node-webkit-app</string>
                        </dict>
                </dict>
        </array>
</dict>
</plist>
