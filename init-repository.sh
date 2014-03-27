#!/bin/bash
# vim:set fenc=utf-8 ts=4 sw=4 et:
LANG='en_US.UTF-8'

clr_info='\e[0;36m'
clr_ok='\e[0;32m'
clr_ask='\e[0;34m'
clr_answ='\e[1;32m'
clr_err='\e[1;31m'
clr_end='\e[0m'

function ok {
    echo -e "${clr_ok}OK${clr_end}"
}

function err {
    echo -e "${clr_err}ERROR${clr_end}" 1>&2
    [ -z $1 ] && exit 1
}

echo -ne "${clr_info}Checking for grunt${clr_end} … "
if [ -e ./node_modules/.bin/grunt ]; then ok; else
    err 1;
    echo -e "${clr_err}No grunt!" \
        "You need to do \`${clr_info}npm install${clr_err}\`" \
        "before this script!${clr_end}" 1>&2
    echo -en "${clr_ask}Do \`${clr_info}npm install${clr_ask}\` now?" \
        "${clr_end} [${clr_answ}Y${clr_end}/n] "
    read do_init
    if echo "$do_init" | grep -i '^y\(es\)\?$' &>/dev/null; then
        if ! npm install; then exit 1; fi
        exit 0
    elif echo "$do_init" | grep -i '^n\(o\)\?$' &>/dev/null; then
        echo -e "${clr_info}You need to do" \
            "\`${clr_ask}npm install${clr_info}\` first."
        exit 1
    else
        echo -e "${clr_err}Incorrect answer!${clr_end}" 1>&2
        exit 1
    fi
fi

echo -ne "${clr_info}Creating symbolic link to grunt cli${clr_end} … "
rm ./grunt &>/dev/null
if ln -s ./node_modules/.bin/grunt ./grunt &>/dev/null; then ok; else err; fi

echo -e "${clr_info}Starting grunt default tasks${clr_end} … "
if ./grunt; then
    echo -en "${clr_info}Grunt default tasks status${clr_end}: "; ok;
else err; fi

# custom init actions
if [ -f ./init-custom.sh ]; then
    . ./init-custom.sh
fi

echo -e "${clr_ok}This repository is correctly initialized!${clr_end}"
exit 0
