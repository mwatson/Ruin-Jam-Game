del build\targets\windows\*
start /wait build\resources\windows\run-grunt.bat
copy build\resources\windows\node-webkit\* build\targets\windows\
cd build\resources\windows
start /wait Resourcer.exe -op:upd -src:..\..\targets\windows\nw.exe -type:14 -name:IDR_MAINFRAME -file:icon.ico
cd ..\..\targets\windows
copy /b nw.exe+package.nw being.exe
del nw.exe package.json package.nw
cd ..\..\..
exit 0
