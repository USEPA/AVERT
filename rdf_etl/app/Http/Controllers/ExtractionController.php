<?php

namespace App\Http\Controllers;

use App\LoadBinEdge;
use App\LoadBinMedian;
use App\Location;
use App\Region;
use App\RegionalLoad;
use App\Run;
use Illuminate\Http\Request;

use App\Http\Requests;
use Maatwebsite\Excel\Facades\Excel;

class ExtractionController extends Controller
{
//    TODO: Convert this into a cli command
    public function showExtraction(){

//        Necessary evil for now. Can make more efficient by turning this into a queue job.
        set_time_limit(300);

        $filePath = '/resources/assets/excel/';
        $file = $filePath . '';
//        $file = $filePath . 'AVERT RDF 2015 EPABase (California) - tabbed.xlsx';
//        $file = $filePath . 'AVERT RDF 2015 EPABase (Northeast) - tabbed.xlsx';
        $sheetNames = [
            'Metadata',
            'Regional Load',
            'Load Bin Edges',
            'Generation (MW)',
            'SO2 Ozone Season (Lbs)',
            'SO2 Not Ozone Season (Lbs)',
            'NOx Ozone Season (Lbs)',
            'NOx Not Ozone Season (Lbs)',
            'CO2 Ozone Season (Tons)',
            'CO2 Not Ozone Season (Tons)',
            'Heat Input Ozone Season (MMBTU)',
            'Heat Non Ozone Season (MMBTU)'
        ];

        $metadata = Excel::selectSheets('Metadata')->load($file);
        $region = $this->extractRegion($metadata);
        $run = $this->extractRun($metadata,$region);
        $loads = $this->extractRegionalLoad($file,'Regional Load',$region,$run);
        $edges = $this->extractLoadBinEdges($file,'Load Bin Edges',$region,$run);

//        $generation = $this->extractMedian($file,$sheetNames[3],$region,$run,$edges,'generation','MW');
//        $so2     = $this->extractMedian($file,$sheetNames[4],$region,$run,$edges,'so2','Lbs');
//        $so2_not = $this->extractMedian($file,$sheetNames[5],$region,$run,$edges,'so2_not','Lbs');
//        $nox     = $this->extractMedian($file,$sheetNames[6],$region,$run,$edges,'nox','Lbs');
//        $nox_not = $this->extractMedian($file,$sheetNames[7],$region,$run,$edges,'nox_not','Lbs');
//        $co2     = $this->extractMedian($file,$sheetNames[8],$region,$run,$edges,'co2','Tons');
//        $co2_not = $this->extractMedian($file,$sheetNames[9],$region,$run,$edges,'co2_not','Tons');
//        $heat    = $this->extractMedian($file,$sheetNames[10],$region,$run,$edges,'heat','MMBTU');
//        $heat_not = $this->extractMedian($file,$sheetNames[11],$region,$run,$edges,'heat_not','MMBTU');

        return view('load');
    }

    private function extractRegion($sheet){
        $data = $sheet->first();

        $region = Region::where('region_name',$data->get('region'))->first();
        if( ! $region) {
            $region = new Region;
            $region->region_name = $data->get('region');
            $region->region_abbv = $data->get('region_abbv');
            $region->region_states = $data->get('states');
            $region->save();
        }

        return $region;
    }

    private function extractRun($sheet,$region){
        $data = $sheet->first();
        $year = $data->get('year') === 'Present Year Analysis' ? 2015 : $data->get('year');
        $run = Run::where('year',$year)->where('file_name',$data->get('file'))->first();

        if( ! $run) {
            $run = new Run;
            $run->year = $year;
            $run->file_name = $data->get('file');
            $run->mc_runs = $data->get('mcruns');
            $run->mc_gen_runs = $data->get('mcgenruns');
            $run->region()->associate($region);
            $run->save();
        }

        return $run;
    }

    private function extractRegionalLoad($file,$sheetname,$region,$run) {
        $lastRegionalLoad = $run->loads()->orderBy('hour_of_year','desc')->first();

        if ($lastRegionalLoad && $lastRegionalLoad->month === 12 && $lastRegionalLoad->day === 31 && $lastRegionalLoad->hour === 23){
            return $run->loads();
        }

        $data = Excel::selectSheets($sheetname)->load($file);

        // Excel service collection does not allow map function :(
        $data->each(function($item, $key) use (&$run,&$region) {
            $regionalLoad = new RegionalLoad([
                'hour_of_year' => $item->get('hour_of_year'),
                'year' => $item->get('year'),
                'month' => $item->get('month'),
                'day' => $item->get('day'),
                'hour' => $item->get('hour'),
                'regional_load_mw' => $item->get('regional_load_mw'),
            ]);
            $regionalLoad->run()->associate($run);
            $regionalLoad->region()->associate($region);
            $regionalLoad->save();
        });

        return $run->loads();
    }

    private function extractLoadBinEdges($file,$sheetname,$region,$run){
        $sheet = Excel::selectSheets($sheetname)->load($file);
        $data = $sheet->first();
        $data->each(function($item,$key) use ($region,$run) {

            $edge = LoadBinEdge::firstOrNew([
                'edge' => $key,
                'edge_value_mw'=>$item
            ]);

            $edge->run()->associate($run);
            $edge->region()->associate($region);
            $edge->save();
        });

        return $run->edges();
    }

    private function extractMedian($file,$sheetname,$region,$run,$edges,$medianType,$medianUnit) {
        $sheet = Excel::selectSheets($sheetname)->load($file);
        $data = $sheet->get();
        $data->each(function($item,$key) use ($region,$run,$edges,$medianType,$medianUnit) {
            $location = $region->locations()->where('orispl_code',$item->get('orispl_code'))->first();

            if( ! $location) {
                $location = new Location([
                    'state' => $item->get('state'),
                    'county' => $item->get('county'),
                    'lat' => $item->get('lat'),
                    'lon' => $item->get('lon'),
                    'fuel_type' => $item->get('fueltype'),
                    'orispl_code' => $item->get('orispl_code'),
                    'unit_code' => $item->get('unit_code'),
                    'full_name' => $item->get('full_unit_name'),
                ]);

                $location->region()->associate($region);
                $location->save();
            }

            $medianMeta = [
                'state' => $item->get('state'),
                'fuel_type' => $item->get('fueltype'),
                'median_type' => $medianType,
                'median_unit' => $medianUnit,
            ];

            foreach($item as $median_key => $median_value) {

                if(in_array($median_key,['state','county','lat','lon','fueltype','orispl_code','unit_code','full_unit_name'])) continue;

//                $edge = $edges->where('edge_value_mw',$median_key)->first();

//                if( ! $edge) continue;

                $median = new LoadBinMedian($medianMeta);
                $median->edge_value_mw = $median_key;
                $median->median = $median_value;

//                $median->edge()->associate($edge);
                // Try to invert this relationship so I can save in mass
                $median->location()->associate($location);
                $median->region()->associate($region);
                $median->run()->associate($run);

                $median->save();
            }
        });
    }
}
