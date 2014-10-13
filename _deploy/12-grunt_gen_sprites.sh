#!/bin/bash
#
# Author: Viacheslav Lotsmanov
# License: GNU/GPLv3 (https://github.com/unclechu/grunt-project-templates/blob/master/LICENSE)
#
if [ -z "$PARENT_DEPLOY_SCRIPT" ]; then YOUR_SUBJECT="./_deploy/$(basename "$0")" WD="$(dirname "$0")/../" ../deploy.sh; exit "$?"; fi

info "Generating sprites"
if ./grunt gen-sprites; then
	info_inline "Generating sprites status:"; ok;
else err; fi
