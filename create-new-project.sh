#!/bin/bash
#
# Author: Viacheslav Lotsmanov
# License: GNU/GPLv3 (https://github.com/unclechu/grunt-project-templates/blob/master/LICENSE)
#

REPO_URL="https://github.com/unclechu/grunt-project-templates/"
REPO_LOCAL_DIR="web-front-end-grunt-template"
REPO_BRANCH="master"

THIS_FILENAME="$(basename "$0")"

clr_info='\e[0;36m'
clr_ok='\e[0;32m'
clr_ask='\e[0;34m'
clr_err='\e[0;31m'
clr_end='\e[0m'

function ok {
	echo -e "${clr_ok}[ OK ]${clr_end}"
	return 0
}

function err {
	echo -e "${clr_err}[ ERR ]${clr_end}" 1>&2
	exit 1
}

function run {
	echo -e "${clr_info}${@}${clr_end} ... "
	"$@" && ok || err
	return 0
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

# get first element in array (by delimiter)
function get_delim_first {
	echo "$1" | sed -e 's/^\([^:]\+\).*$/\1/'
}

function remove_delim_first {
	item=$(echo "$1" | sed -e 's/^\([^:]\+\).*$/\1/')
	echo "${1:$[${#item}+1]}"
}

if [ -z "$1" ]; then
	exit $?
else
	REPO_BRANCH="$1"
fi

run git init
run git clone -b "$REPO_BRANCH" "$REPO_URL" "$REPO_LOCAL_DIR"

arr=$(ls "./$REPO_LOCAL_DIR/" \
	| grep -iv README \
	| grep -iv node_modules \
	| grep -iv LICENSE \
	| grep -ivF "$THIS_FILENAME" \
	| tr '\n' ':')
while true; do
	[ -z "$arr" ] && break
	item=$(get_delim_first "$arr")
	arr=$(remove_delim_first "$arr")

	if [ -d "./$REPO_LOCAL_DIR/$item" ]; then
		run cp -R "./$REPO_LOCAL_DIR/$item/" ./
	else
		run cp "./$REPO_LOCAL_DIR/$item" ./
	fi
done

run cp "./$REPO_LOCAL_DIR/.gitignore" ./

run npm install

echo -e "${clr_ok}Success! Project created by template \"$REPO_BRANCH\".${clr_end}"

if [ -f "$THIS_FILENAME" ]; then
	ask "Remove \"${clr_info}${THIS_FILENAME}${clr_ask}\" script?" && rm "$THIS_FILENAME"
fi
if [ -d "$REPO_LOCAL_DIR" ]; then
	ask "Remove temporary directory \"${clr_info}${REPO_LOCAL_DIR}${clr_ask}\"?" && rm -rf "$REPO_LOCAL_DIR"
fi
exit 0
