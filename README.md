# FamilyDecoration/app

This folder contains the javascript files for the application.

# FamilyDecoration/resources

This folder contains static resources (typically an `"images"` folder as well).

# FamilyDecoration/overrides

This folder contains override classes. All overrides in this folder will be 
automatically included in application builds if the target class of the override
is loaded.

# FamilyDecoration/sass/etc

This folder contains misc. support code for sass builds (global functions, 
mixins, etc.)

# FamilyDecoration/sass/src

This folder contains sass files defining css rules corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'FamilyDecoration'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in FamilyDecoration/.sencha/app/sencha.cfg. 

# FamilyDecoration/sass/var

This folder contains sass files defining sass variables corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'FamilyDecoration'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in FamilyDecoration/.sencha/app/sencha.cfg. 

# Preliminary work before getting started
Please config sencha.cfg under within the path(FamilyDecoration/.sencha/workspace) before you use it.

see the following line, please change the dir address in a proper place.(absolute path)
"
# workspace.build.dir=${workspace.dir}/build # ORIGINAL BUILD PATH. PLEASE EDIT IT BEFORE YOU USE
workspace.build.dir= C:/Program Files (x86)/Zend/Apache2/htdocs/fd
"