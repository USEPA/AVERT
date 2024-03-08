# Annual Updates

All changes should happen on a new feature branch:

1. Apply text changes to the year (and any other changes needed) below map on
   the "Select Geography" panel (`client/src/app/components/Panels.tsx`). Note
   the Excel app version will likely need to be updated as well ("v4.3").

2. Potentially replace EERE defaults JSON files (not often updated) – files
   stored in `server/app/data/` directory.

3. Replace JSON RDFs with new versions (files stored in `server/app/data/`
   directory), replace `server/app/data/annual-emissions-factors.json` with
   latest version and update `year` and `regions` (EERE and RDF filenames)
   fields in `server/app/config.js`.

4. Cross-check EGUs from the latest year shown in Excel document's
   "Table 3: EGUs with infrequent SO2 emission events" from the "Library" sheet
   with the corresponding EGUs in the JSON RDF files. If they're shown in the
   Excel sheet, the corresponding EGU in the JSON RDF should have an
   `infreq_emissions_flag` value of `1`. This should be the case, just double
   checking that the JSON RDFs were correctly updated by Synapse, as it was
   mentioned this is a manual process on their end.

5. Run web app locally with updated files – run through the entire user flow
   (select region, enter energy impacts inputs, see results) for each of the 14
   regions, and test a couple states too for good measure. If the new files are
   valid there should be no errors.

6. Update `regions` object in `client/src/app/config.ts` file to include latest
   "actual emissions values" from Table 3 in the "Library" sheet of the Excel
   workbook. Use the values in the "Actual SO2 emissions(lb)" row of the table –
   add or update the value for each region affected for the current year
   (`actualEmissions` key in the `regions` object), and be sure to remove any
   values for regions that no longer have EGUs with infrequent SO2 emission
   events for the current year.

7. Update `lineLoss` object in `client/src/app/config.ts` file to include latest
   line loss values from "Table 2: T&D losses" found in the "Library" sheet of
   the Excel workbook.

8. Confirm FIPS codes haven't changed this year (very rare they'll change). If
   they have, `fipsCodes` object in `client/src/app/config.ts` file would need
   to be updated.

9. Confirm each AVERT regions' boundaries haven't changed this year (very
   uncommon – only happened once when the number of regions increased). If they
   have, the `regions` object's `percentageByState` fields and the `states`
   object's `percentageByRegion` fields (both in the `client/src/app/config.ts`
   file) would need to be updated, along with the React components in the
   `client/src/app/components/Regions/` directory.

10. Update Cypress tests (files in `client/cypress/integration/` directory) to
    reflect the updated values returned from using the updated RDFs. This is
    important and worth taking the time to do, so we have a new baseline for any
    new features that may be added before the next annual update.

11. Update packages for each of the three projects ("client" app, "server" app,
    and top-level "orchestrating" app). Be sure to read each package's CHANGELOG
    before applying updates and run the app locally to test things after each
    package update.

12. Run web app locally one final time and run through the entire user flow
    (select region, enter energy impacts inputs, see results) for a few of the
    regions, and a few of the states. Really just one final test that nothing
    has broken as a result of all the previous changes made. It's also a good
    idea to compare the results from a few runs in the web version with the
    results from the same run in the Excel version, to ensure they're the same
    (although our QA testing should also do this).

13. Update the version number of all three apps ("client" app, "server" app, and
    top-level "orchestrating" app) in each project's `package.json` file to
    remain in sync with updated Excel app's version number.

14. Build app for development (see "Development Deployment" instructions in
    client app's README file (`client/README.md`) and push a new version to the
    Cloud.gov dev site. Verify updated dev app is working as expected at
    https://avert-dev.app.cloud.gov.

15. Build app for production (see "Production Deployment" instructions in client
    app's README file (`client/README.md`).

Push new feature branch up to the EPA repo and issue a new pull request. After
QA testing has completed on Cloud.gov dev site with errors, merge pull request
from the feature branch into the `master` branch and notify the client the app
is ready to be scanned. Upon successful scans, EPA has deployment instructions
for deploying to production Cloud.gov space. Tag a new release on GitHub to
close out the annual updates.
