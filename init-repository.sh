#!/bin/bash
#
# Author: Viacheslav Lotsmanov
# License: GPLv3
#

clr_info='\e[0;36m'
clr_ok='\e[0;32m'
clr_ask='\e[0;34m'
clr_err='\e[1;31m'
clr_end='\e[0m'

function ok {
    echo -e "${clr_ok}[ OK ]${clr_end}"
    return 0
}

function err {
    echo -e "${clr_err}[ ERR ]${clr_end}" 1>&2
    [ -z $1 ] && exit 1
}

function ask {
    echo -en "${clr_ask}${@}${clr_end} [Y/n] "
    read answer

    if echo "$answer" | grep -i '^y\(es\)\?$' &>/dev/null; then
        return 0
    elif echo "$answer" | grep -i '^n\(o\)\?$' &>/dev/null; then
        return 1
    else
        echo -e "${clr_err}Incorrect answer!${clr_end}" 1>&2
        exit 1
    fi
}

function info_inline {
    echo -ne "${clr_info}${@}${clr_end} ... "
}

function info {
    echo -e "${clr_info}${@}${clr_end} ... "
}

function info_clean {
    echo -e "${clr_info}${@}${clr_end}"
}

info_inline "Checking for grunt"
if [ -e ./node_modules/.bin/grunt ]; then ok; else
    err 1;
    info "${clr_err}No grunt!" \
        "You need to do \`${clr_info}npm install${clr_err}\`" \
        "before this script!" 1>&2

    if ask "Do \`${clr_info}npm install${clr_ask}\` now?"; then
        if ! npm install; then exit 1; fi
        exit 0
    else
        info "You need to do \`${clr_ask}npm install${clr_info}\` first."
        exit 1
    fi
fi

info_inline "Creating symbolic link to grunt-cli"
rm ./grunt &>/dev/null
if ln -s ./node_modules/.bin/grunt ./grunt &>/dev/null; then ok; else err; fi

info "Starting grunt default tasks"
if ./grunt; then
    info_inline "Grunt default tasks status:"; ok;
else err; fi

# custom init actions
if [ -f ./init-custom.sh ]; then
    source ./init-custom.sh
fi

info_clean "${clr_ok}This repository is correctly initialized!"
exit 0

# vim:set ts=4 sw=4 et:
