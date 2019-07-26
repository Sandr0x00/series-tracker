import os

# Function to rename multiple files
def main():
    i = 0

    folder = "../static/img/"

    for filename in os.listdir("img"):
        new_name = filename.replace(" ", "_")
        new_name = new_name.replace("-", "_")
        new_name = new_name.lower()
        src = folder + filename
        dst = folder + new_name

        # rename() function will
        # rename all the files
        os.rename(src, dst)
        i += 1

if __name__ == '__main__':
    main()