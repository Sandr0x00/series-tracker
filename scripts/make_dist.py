#!/usr/bin/env python3

import os
import shutil

if __name__ == "__main__":
    folder = 'dist'
    if not os.path.isdir(folder):
        os.mkdir(folder)
    else:
        shutil.rmtree(folder)
        os.mkdir(folder)

    print("[ ] Copying files.", end="\r")

    shutil.copy('Makefile', 'dist')
    shutil.copytree('src', 'dist/src')
    shutil.copytree('static', 'dist/static', ignore=shutil.ignore_patterns('.gitignore'))

    print("[\x1B[32m✓\x1b[0m] Copy files finished.")