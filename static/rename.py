import os

# Function to rename multiple files
def main():
    i = 0

    for filename in os.listdir("img"):
        new_name = filename.replace(" ", "_")
        new_name = new_name.replace("-", "_")
        new_name = new_name.lower()
        src ='img/'+ filename
        dst ='img/'+ new_name

        # rename() function will
        # rename all the files
        os.rename(src, dst)
        i += 1

# Driver Code
if __name__ == '__main__':

    # Calling main() function
    main()