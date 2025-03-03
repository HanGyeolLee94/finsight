@echo off

echo Running import_table.bat...
call import_table.bat

echo Running import_data.bat...
call import_data.bat

echo Running import_foreignkey.bat...
call import_foreignkey.bat

echo Running import_view.bat...
call import_view.bat

echo All scripts have been executed.
pause
