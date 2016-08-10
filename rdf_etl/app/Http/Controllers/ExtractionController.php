<?php

namespace App\Http\Controllers;

use App\Region;
use App\Run;
use Illuminate\Http\Request;

use App\Http\Requests;
use Maatwebsite\Excel\Facades\Excel;

class ExtractionController extends Controller
{
    public function showExtraction(){
        $filePath = '/resources/assets/excel/';
        $file = $filePath . 'AVERT RDF 2015 EPABase (California) - tabbed.xlsx';
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

//        $run = $this->extractMetadata($file,'Metadata');
        $metadata = Excel::selectSheets('Metadata')->load($file);
        $region = $this->extractRegion($metadata);
        $run = $this->extractRun($metadata,$region);
        $loads = $this->extractRegionalLoad($file,'Regional Load',$region,$run);
//        $edges = $this->extractLoadBinEdges($file,'Load Bin Edges',$run);

        return view('load');    
    }
//
//    private function extractMetadata($file,$sheetname) {
//        $metadata = Excel::selectSheets($sheetname)->load($file);
//        $data = $metadata->first();
//
//        $region = Region::where('region_name',$data->get('region'))->first();
//        if( ! $region) {
//            $region = new Region;
//            $region->region_name = $data->get('region');
//            $region->region_abbv = $data->get('region_abbv');
//            $region->region_states = $data->get('region_abbv');
//            $region->save();
//        }
//        $year = $data->get('year') === 'Present Year Analysis' ? 2015 : $data->get('year');
//        $run = Run::where('year',$year)->first();
//
//        if( ! $run) {
//            $run = new Run;
//            $run->year = $year;
//            $run->file_name = $data->get('file');
//            $run->mc_runs = $data->get('mcruns');
//            $run->mc_gen_runs = $data->get('mcgenruns');
//            $run->region()->associate($region);
//            $run->save();
//        }
//
//        return $run;
//    }

    private function extractRegion($sheet){
        $data = $sheet->first();

        $region = Region::where('region_name',$data->get('region'))->first();
        if( ! $region) {
            $region = new Region;
            $region->region_name = $data->get('region');
            $region->region_abbv = $data->get('region_abbv');
            $region->region_states = $data->get('region_abbv');
            $region->save();
        }

        return $region;
    }

    private function extractRun($sheet,$region){
        $data = $sheet->first();
        $year = $data->get('year') === 'Present Year Analysis' ? 2015 : $data->get('year');
        $run = Run::where('year',$year)->first();

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

        $data->each(function($item, $key) use (&$run,$region) {
            $load = [
                'hour_of_year' => $item->get('hour_of_year'),
                'year' => $item->get('year'),
                'month' => $item->get('month'),
                'day' => $item->get('day'),
                'hour' => $item->get('hour'),
                'regional_load_mw' => $item->get('regional_load_mw'),
            ];

            $loadModel = $run->loads()->create($load);
            $region->loads()->associate($loadModel);
            var_dump($loadModel);
            if($key > 1) return false;
//            $run->region()->associate($load);
        });

        $run->save();



        return $run->loads();
    }
}
