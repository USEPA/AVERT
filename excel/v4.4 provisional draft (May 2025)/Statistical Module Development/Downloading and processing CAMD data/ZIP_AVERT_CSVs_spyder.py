# -*- coding: utf-8 -*-
"""
Created on Fri Feb 21 14:21:06 2025

@author: iweiss
"""

import os
import pandas as pd
import numpy as np
import time
import zipfile
from zipfile import ZipFile

starttime = time.time()

# UPDATE THE DIRECTORY AND SAVEDIRECTORY FILEPATHS TO THE APPROPRIATE FOLDERS, AS DESCRIBED BELOW, FOR EACH ANNUAL UPDATE:
# directory should be the file path that contains the CSVs that need to be zipped. All CSVs should be directly in the final folder in this directory and should not be nested in subsequent folders.
directory = "C:\\Users\\afuzaylov\\Downloads\\Reformatted with quotes\\Reformatted with quotes\\"

# savedirectory is the file path where the zipped files will be saved.
savedirectory = "C:\\Users\\afuzaylov\\Downloads\\"

# This code should not need to be udpated to zip the CSVs:
filelist = os.listdir(directory)

for file in filelist:
    print(file)

    if any(char in file for char in '<>:"/\\|?*'):
        print(f"Skipping file due to invalid characters: {file}")
        continue

    zipObj = ZipFile(savedirectory + file[2:-4] + ".zip", "w")
    zipObj.write(directory + file, file[:-4] + ".csv")
    zipObj.close()


endtime = time.time()

totaltime = endtime - starttime
print("total time is ", totaltime)
