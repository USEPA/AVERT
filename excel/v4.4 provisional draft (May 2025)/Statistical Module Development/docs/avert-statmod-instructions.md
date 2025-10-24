# Full Instructions for Preparing and Running the Stat Mod

These instructions document the steps needed for performing the annual data update for AVERT and generating the Regional Data Files (RDFs) required for running AVERT. This process happens with the use of two primary MATLAB tools: 

1. **CAMD Raw Data Pre-Processor:** a module that processes hourly generation and emissions data from EPA's Clean Air Markets Program Data (CAMPD) into its appropriate form; and

2. **Statistical Module (StatMod):** a module in which the statistical analyses are conducted for each AVERT region. The StatMod produces Regional Data Files (RDFs) containing unit-specific probability distribution functions as well as regional fossil load for every hour. These RDFs are then usable in other AVERT tools, including the Main Module and web edition.

>**NOTE: These tools rely on a specific folder structure in order to run properly. Before following these instructions, we highly recommend replicating the folder structure and files provided here on your desktop. Do not alter naming conventions.**

## Instructions:

### Step 1: If necessary, update the Future Year Scenario Template (FYST)

1. The first step of the AVERT process is to download annual Clean Air Markets Program Data (CAMPD) and check if the Future Year Scenario Template (FYST) needs to be updated. We provide a ready-to-use FYST, but if any units have been added or retired since the latest publication of the FYST, it will need to be updated.

2. CAMPD is available at: https://campd.epa.gov/data/custom-data-download
    - Under “Data Type,” click “Emissions”. Under “Data Subtype” click “Annual Emissions.” Under “Aggregation,” leave it as “Unit (No Aggregation)”. Click Apply. Click “Preview Data.” Then click “Download (as a CSV)”.

3. Open the most recent FYST (within the Process CAMD Data > FacilityData directory).

4. Compare the downloaded CAMPD data against the `EPA_AMP` tab of the FYST. 
>    - **If there is a one-to-one match of units between the two files, then you do not need to update the FYST and can now skip to Step 2 below.**
>    - **However, if there are any differences in units (e.g., any more or fewer units), you must update the FYST by following the rest of the sub-steps in this step.**

5. Copy the downloaded CAMPD data into the `EPA_AMP` tab of the FYST. You’ll only be able to populate some of the columns (see the next step for more).

6. Next, go back to the CAMPD website. Under “Data Type,” click “Facility”. Click Apply. Click the year you are interested in, then click “Apply Filter.” Click “Preview Data.” Then click “Download (as a CSV)”.

7. Copy the resulting data into the remaining columns of `EPA_AMP`. You may want to do this using an INDEX/MATCH set of columns.

8. Fix Unit IDs that were not read in properly. Are there any units with Unit IDs that need to be fixed? For example, Excel will commonly read a unit ID of 1-1 as January 1.  You’ll have to change this to ‘1-1. In other situations, you’ll see a unit ID of (for example) 28, when it should be entered as ‘0028. You will have to do this for many plants (perhaps 300).

9. Make sure that every single unit has an exact match in last year’s dataset, unless it is a new unit.

10. Delete all of the data in columns Z and AC ("Manual data”). Using last year’s FYST, re-enter the manual data. For any new plants that are not matched, look them up in the EIA data or search for them online.

11. Delete the data in columns W and X. You will update this at the very end of the Annual Update process.

12. Review the `EPA_Facilities` tab:
    - Ensure that the formulas are filled down to a sufficient number of rows to capture all units.
    - Check for #N/A and other errors in the Fuel Definition column (V); add new fuel type designations to the `RefTables` tab as necessary.
    - Check for #N/A and other errors in the AVERT Region column (AI).
    - Check for #N/A and other errors in the Final PM2.5 Emissions Rate, NTG Factor, and CO2 Content columns (AX, AZ, and BA). Resolve errors if necessary.

### Step 2.	Download and Process Hourly Emissions Data From EPA
1.	Download hourly emissions data from the EPA FTP server, available at https://campd.epa.gov/data/custom-data-download.
    - Go to Data > Bulk Data Files > Download Data Files.
    - Select Data Type “Emissions”, Subtype “Hourly”, and Grouping “State”.
    - Under the Bulk Data Files, download all state files that are associated with your year of interest. You will download one file each for 48 states plus DC, totaling 49 files.
>    - **NOTE: Do not include data for Hawaii, Alaska, or Puerto Rico; only include data for the 48 contiguous states and DC. Including other regions will cause the code to break.**

2.	Save these files in the directory:
```
Downloading and processing CAMD data > Data from CAMD website
```

3.	Post-process the files into a format compatible with the MATLAB tools. This processing step will create 588 files (one for each of the 49 analyzed states and months) and will also add quotation marks where needed.
    - First, the data needs to be reformatted so that the order of the columns matches an older version of the dataset. To do this, run the R-script `data_reformat.Rmd`. 
        - **Note:** You will need to update any instances of “2024” (the latest data year processed with this script) to match the current data year you are processing), before running the script.
    - In addition to re-ordering the data, the data must be in UTF8 format. This step makes it so that all values between commas are in a single pair of double quotes. For example, the first two rows should look like:
    
    ``` 
    "STATE","FACILITY_NAME","ORISPL_CODE","UNITID","OP_DATE","OP_HOUR","OP_TIME","GLOAD (MW)","SLOAD (1000lb/hr)","SO2_MASS (lbs)","SO2_MASS_MEASURE_FLG","SO2_RATE (lbs/mmBtu)","SO2_RATE_MEASURE_FLG","NOX_RATE (lbs/mmBtu)","NOX_RATE_MEASURE_FLG","NOX_MASS (lbs)","NOX_MASS_MEASURE_FLG","CO2_MASS (tons)","CO2_MASS_MEASURE_FLG","CO2_RATE (tons/mmBtu)","CO2_RATE_MEASURE_FLG","HEAT_INPUT (mmBtu)" 
    ```
    ```   
    "AL","Barry","3","1","2022-01-01","0","0","","","","","","","","","","","","","","",""
    ```

    - To convert the data files into the correct file format, follow the following steps:
        - Copy the CSV files into a single folder on your desktop. Don’t include the words “edit” or “format” in the folder title. Calling it “AVERT” is fine.
        - Make a list of all the files and put the list into the Excel workbook `_formulas to add quotes.xlsx`, beginning in cell B9. Columns C, D, and E should automatically update.
        - Copy the whole set of UTF8 PowerShell commands (range C9:C596), and go back to the folder on your desktop.
        - Hold down shift, and right-click on any blank space in that folder. Don’t select any files.
        - A menu will pop-up. Press “Open PowerShell window here”.
        - A blue command window will pop up. Press CTRL+V. All of your PowerShell lines will be pasted.
        - Press enter. It will take 1-2 hours to run.
        - Save the resulting files in Downloading and processing CAMD data > Reformatted with quotes.

    - Convert the CSV files back into zip files using the Python script `ZIP_AVERT_CSVs_spyder.py`.
        - *directory* > this file path should be the directory that contains the CSV files that need to be zipped (Reformatted with quotes folder). The CSVs should not be within subfolders. All 588 files should directly be within the final folder in this directory.
        - *savedirectory* > this file path should be the directory where the zipped CSVs should be saved. All 588 zip files will be saved in the same folder, eventually labeled as the year of the current annual update.
        - This code will take about 10 minutes to run.

4. Copy the 588 zip files into the following folder (or rename the "2024" folder with the data year you are working with):
```
Process CAMD Data > CAMD > 2024
```

### Step 3.	Process the CAMD Data in MATLAB

1. The `AVERT_ReadCAMDEmissionsData.m` script converts the data into a “flat” format – i.e., with the data organized horizontally by unit rather than vertically, and without subfields or any text structures – and sets each data type into an array.

2. To Run the Script:
    - Open the `AVERT_ReadCAMDEmissionsData.m` in MATLAB.
    - Find and change the file paths in the script to the folder in which the current year’s data is stored. **There are four file paths that need to be updated.** Search for “annual update” in the MATLAB script to find them.
    - Run the script. Note that this part of the script will take around 10 hours to run. Make sure the computer running the code does not fall asleep or the code will break.
    - When given the choice during the “Choose Facility Data File:” popup, choose “AVERT Future Year Scenario Template 20YY New Regions.xlsx”.
    - When asked to “Choose year to parse”, choose the current data year you are working with.
    - The script will break after unzipping and running the data for all states, after about 12-15 hours. This is expected. Example of the break:
    ```
    Undefined function or variable ‘MPCCO2’.<br>
    Error in AVERT_ReadCAMDEmissionsData (line 468)<br>
    For u = 1:length(MPCCO2)
    ```
    - To address this break, you must manually import the `CAMDtoFilter_2024.xlsx` file (or equivalent file for the current year) after the break occurs. To do this, see the following steps.
    - In the MATLAB console, select "Import Data" from the header and navigate to the `CAMDtoFilter_20YY.xlsx` file.
    - Select the file and click “Open”.
    - An import window in MATLAB will open. In the header, make sure "Column Vectors" is selected in the "Imported Data" section. This will make each column of data its own variable in MATLAB. 
    - Select "Import Selection" to import the data.
    - The variable names should be:
        - MPCLUTCode
        - MPCHour
        - MPCCO2
        - MPCSO2
        - MPCNOx
    - In the header of the `AVERT_ReadCAMDEmissionsData.m` code file, click "Run" to finish running the code. It should successfully run to the end at this point and will only take a few minutes. The code is done after “Have a good day.” has been displayed in the MATLAB Command Window.

### Step 4.	Run the AVERT Statistical Module and Generate RDFs

1.	Copy the processed input file titled `AVERT_CAMDArray_20YY_Update.mat` into the folder (this .mat file was an output of Step 2. Process the CAMD Data in MATLAB):
```
AVERT Attachment Folders for Package > CAMD Input Files
```

2.	Copy the FYST into this folder:
```
AVERT Attachment Folders for Package > AVERT Future Year Scenarios
```

3.	Before running the AVERT Statistical Module (StatMod), you will need to have the JSONLab toolbox installed in MATLAB. 
    - To check if you have the JSONLab toolbox, open MATLAB and enter the following command:<br> 
        `which savejson`
    - If you have an output, JSONLab is already installed and you are set to proceed with running the AVERT Statistical Model. If you do not have an output, follow these steps to install the JSONLab toolbox:
        - Download the JSONLab toolbox from Mathworks using this link: https://www.mathworks.com/matlabcentral/fileexchange/33381-jsonlab-a-toolbox-to-encode-decode-json-files (“JSONLab: a toolbox to encode/decode JSON files” by Qianqian Fang).
        - Unzip the downloaded root folder (the jsonlab-2.0 folder within the jsonlab-2.0 folder) to the following location on your device: 
        ```
        C:\Program Files\MATLAB\R2012b\toolbox\matlab
        ```
        - Open the MATLAB console.
        - Add the folder’s path to MATLAB’s path list with the following command:<br> 
            `addpath('C:\Program Files\MATLAB\R2012b\toolbox\matlab\jsonlab-2.0');` <br>
                    
            - Note that the name of the JSONLab file may update depending on the release version. Adjust the file path accordingly.
        - You must also permanently add this file path. To do so, enter the command: <br>
        `pathtool`
        - Browse to the JSONLab root folder and add it to the list. Click “Save.”
        - Run the command:<br>
        `rehash`
        - To confirm the file path was added permanently, run the following command: 
        `which savejson`
        - If there is an output, the JSONLab was permanently installed.

4.	Open the `AVERT_Statistical_Module_Main.m` file.

5.	In line 16, update the month and year printed to the month and year of release for the current annual update (Qstring.b = sprint(‘Synapse Energy Economics, April 2025’);)

6.	Run the script titled `AVERT_Statistical_Module_Main.m`.

7.	Use default values for the number of Monte Carlo runs (1000 runs, 500 generation-only runs) and the minimum generation(1000 MWh) to participate. Enter Y in the “Produce output files?” field and name the run “EPA_NetGen_PMVOCNH3”. Press “OK”.

8.	When prompted to choose a CAMD Dataset, select “AVERT_CAMDArray20YY_UPDATE.mat”.

9.	When prompted to Choose Future Year Scenario, select “Present year Analysis (no modifications)”.

10.	When prompted, select the regions to run. Then press “OK”.

11.	The StatMod will produce one Excel file and two JSON files per region. The StatMod MATLAB code will produce about 1 RDF per hour. 

### Step 5.	Return and apply final updates to the FYST

1. In Matlab, type the following command, and press enter:  
    `csvwrite('GLoadArrayExport.csv',GLoadArray)`
    - This array contains an hourly generation profile for every unit.
    - It can be used to sum the total generation for each unit, or to identify the maximum hourly generation value for each unit.
	- Each row is not labeled, but the units are listed in the same order as they appear in the FYST.

2.	Using the newly-exported CSV, for each plant, calculate the sum of all generation values (e.g., in Excel using the "SUM" function) and the maximum generation value (e.g., in Excel using the "MAX" function). Open the FYST, and paste this information in the appropriate place.
    - Go to the `CapacityGen` tab. Ensure that the list of units matches those on `EPA_AMP`. 
	- Paste the generation and capacity data into columns D and E. 
	- In column F, make an estimate of each unit's capacity factor by dividing the generation by the capacity times 8,760 (or 8,784 if the data year in question is a leap year).

3.  Go to the `EPA_Facilities` tab. Select data from columns V through AG, and paste this data into columns F through P of the `Dropdowns` tab. 
	- You will not need every column in V through AG, and columns will be in a different order than they appear in `EPA_Facilities`.
	- Once finished, sort columns F through P on the `Dropdowns` tab as directed (i.e., sort by AVERT Region > Fuel Type > Unit Type > Unit).