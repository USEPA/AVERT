#!/bin/sh

rsync --archive --delete ./build/ ../epa-avert-webservice/app/public/
