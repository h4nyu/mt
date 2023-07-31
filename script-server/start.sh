#!/bin/sh
CURRENT=$(cd $(dirname $0) && pwd)
echo $CURRENT
python /script-server/launcher.py -d $CURRENT
