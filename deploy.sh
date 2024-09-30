#!/bin/sh
# set -e

readonly PROGNAME=$(basename $0)
readonly PROGDIR=$(readlink -m $(dirname $0))
readonly ARGS="$@"
readonly TARGET="user@myserver.tld:/var/www/bangleapps"
readonly RSYNC_OPTIONS=("--delete" "--archive" "--verbose"
    "--exclude=.git" "--exclude=.github"
    "--exclude=tests" "--exclude=testing"
    "--exclude=bin" "--exclude=deploy.sh"
    )

buildSite(){
    echo -e "[${KOLORO_NIGRA_DIKA}${PROGNAME}${KOLORO_NORMA}] Build site"
    ${PROGDIR}/bin/create_apps_json.sh
    cd "$PROGDIR/typescript"
    npm ci
    npm run build
    cd -
}

publish(){
    echo -e "[${KOLORO_NIGRA_DIKA}${PROGNAME}${KOLORO_NORMA}]Publishing to ${KOLORO_BLUA_DIKA}${TARGET}${KOLORO_NORMA}"
    rsync ${RSYNC_OPTIONS[@]} ${PROGDIR}/* ${TARGET}
}



main(){
    source difiniKoloro.sh
    # buildSite
    publish
}

main

exit 0
