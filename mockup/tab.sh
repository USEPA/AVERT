#!/bin/sh
# operating system string
OS=$(uname)
# if on a Mac, open new Terminal tabs
if [[ "$OS" == "Darwin" ]]; then
  osascript -e "tell application \"System Events\" to tell process \"Terminal\" to keystroke \"t\" using command down" -e "tell application \"Terminal\" to do script \"cd `pwd`; $1\" in window 1"
# if on a PC, open new Git Bash windows
elif [[ "$OS" == "MINGW64_NT-6.1" ]]; then
  start $1
fi
