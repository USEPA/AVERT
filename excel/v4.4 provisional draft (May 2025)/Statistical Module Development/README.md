# EPA’s Avoided Emissions and Generation Tool (AVERT) Statistical Module

This directory includes all necessary scripts and documentation to process hourly unit-level energy generation data from [EPA’s Clean Air Markets Program Data (CAMPD)](https://campd.epa.gov/data/custom-data-download) and perform statistical analysis to produce regional data files (RDFs) compatible with EPA’s Excel-based [AVoided Emissions and geneRation Tool (AVERT)](https://www.epa.gov/avert/download-avert) Main Module.

## Running the AVERT Statistical Module

Replicating the steps needed to perform the annual data update for AVERT and generate the Regional Data Files (RDFs) required for running AVERT requires the following:

1.	Installation of MATLAB R2012b, which requires a license to run. Note that version R2012b must be used, and more recent versions will not allow the provided scripts to run properly.
2.	Use of R.
3.	Use of Python.
4.	Use of Windows PowerShell commands.

In addition, before attempting to replicate the process, the following directory structure must be replicated locally:
* AVERT Attachments Folder for Package
    * AVERT Future Year Scenarios
    * AVERT Output
    * CAMD Input Files
* CAMD MPC 
* Process CAMD Data
    * CAMD
        * 2024 *[or equivalent data year]*
    * FacilityData

If this is your first time running the AVERT Statistical Module locally, download all contents of the “AVERT Attachments Folder for Package”, “CAMD MPC”, and “Process CAMD Data” directories in this repository and save them in the equivalent folders in the structure described above. Navigate to the [docs](/docs) directory for the complete set of instructions for performing the annual data update for AVERT and running the AVERT Statistical Module.

## Outputs
The AVERT Statistical Module outputs 14 .XLSX Regional Data Files (RDFs), one for each of the 14 regions in AVERT, compatible with the Excel-based [AVERT Main Module](https://www.epa.gov/avert/download-avert). The module also outputs two .json files for each of the 14 AVERT Regions, for use by [AVERT Web Edition](https://www.epa.gov/avert/avert-web-edition).

## Contributing to the AVERT Statistical Module

Please submit any questions about the AVERT Statistical Module to [this web form](https://www.epa.gov/avert/forms/contact-us-about-avert).

If you would like to ask a question about or report an issue in the code, review the CONTRIBUTING policy and submit an issue under the "Issues" tab in the GitHub repository. Provide a concise summary as the title of the issue and a clear description, including steps to reproduce the issue.

## Disclaimer
This United States Environmental Protection Agency (EPA) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. EPA has relinquished control of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by EPA. The EPA seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by EPA or the United States Government.