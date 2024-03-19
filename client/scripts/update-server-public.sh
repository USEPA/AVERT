#!/bin/sh

rsync --archive --delete ./build/ ../server/app/public/
