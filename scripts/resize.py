import os

x = 500
y = 500

folder = "../static/img/"

files = []
for (dirpath, dirnames, filenames) in os.walk(folder):
    files.extend(filenames)
    break

for f in files:
    os.system(f"convert {folder}{f} -resize {x}x{y}\\> {folder}{f}")
