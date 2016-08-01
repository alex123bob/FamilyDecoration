JS=`find ./app -type f  | grep "\.js" | grep -v libs | grep -v "min\.js" | grep -v "\.json"`
for f in $JS  ; do
  printf $f
  java -jar yuicompressor-2.4.6.jar $f -o tmp.js 2>error.log;
  v=`cat error.log`
  if [ "$v" = "" ] ; then
	echo "-----ok"
  else
	cat error.log
	echo .
	echo '错误文件：'$f
	echo .
	exit
  fi
done

