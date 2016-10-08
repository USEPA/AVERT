<?php

namespace App\Http\Controllers;

use App\Limit;
use App\LoadBinEdge;
use App\LoadBinMedian;
use App\Location;
use App\Region;
use App\RegionalLoad;
use App\Run;
use Illuminate\Http\Request;

use App\Http\Requests;

class RegionController extends Controller
{
    public function listRegions(Request $request) {

        $regions = Region::all();
        $regions->transform(function($item, $key) use ($request) {

            unset($item->created_at);
            unset($item->updated_at);
            $item['url'] = $request->url() . '/' . $item['region_name'];

            return $item;
        });

        return response()->json([
            'regions' => $regions
        ]);
    }

    public function getRuns(Request $request, $name) {
//        $region = Region::where('region_name',$name)->with('runs','loads','edges','medians','locations')->first();
        $region = Region::where('region_name',$name)->first();

        $runs = Run::where('region_id',$region->id)->get();
        $runs->transform(function($item,$key) use ($request) {
            $item['url'] = $request->url() . '/year/' . $item['year'];

            return $item;
        });

        $limits = Limit::where('region_id',$region->id)->get();

        return response()->json([
            'region' => $region,
            'runs' => $runs,
            'limits' => $limits,
        ]);
    }

    public function getYear(Request $request, $name, $year) {
        $region = Region::where('region_name',$name)->first();
        $run = Run::where('region_id',$region->id)->where('year',$year)->first();
        $limits = Limit::where('region_id',$region->id)->where('year',$year)->first();
        $dataBasePath = $request->url() . '/data/';
        return response()->json([
            'region' => $region,
            'run' => $run,
            'limits' => $limits,
            'data' => [
                'All' => $dataBasePath . 'all',
                'Generation (MW)' => $dataBasePath . 'generation',
                'SO2 Ozone Season (Lbs)' => $dataBasePath . 'so2',
                'SO2 Not Ozone Season (Lbs)' => $dataBasePath . 'so2_not',
                'NOx Ozone Season (Lbs)' => $dataBasePath . 'nox',
                'NOx Not Ozone Season (Lbs)' => $dataBasePath . 'nox_not',
                'CO2 Ozone Season (Tons)' => $dataBasePath . 'co2',
                'CO2 Not Ozone Season (Tons)' => $dataBasePath . 'co2_not',
                'Heat Input Ozone Season (MMBTU)' => $dataBasePath . 'heat',
                'Heat Non Ozone Season (MMBTU)' => $dataBasePath . 'heat_not'
            ]
        ]);
    }

    public function getData(Request $request, $name, $year, $data_type) {

        $region = Region::where('region_name',$name)->first();
        $run = Run::where('region_id',$region->id)->where('year',$year)->first();
        $limits = Limit::where('region_id',$region->id)->where('year',$year)->first();
        $regionalLoad = RegionalLoad::where('region_id',$region->id)->get();


        $loadBinEdges = LoadBinEdge::where('region_id',$region->id)->get();
        $loadBinEdges = $loadBinEdges->reject(function ($item, $key) {
            return  $item['edge_value_mw'] === 0 && $item['edge'] === 0;
        });

        $edgeArray = $loadBinEdges->map(function($item){
            return $item['edge_value_mw'];
        });

        $numEdges = count($loadBinEdges);
        $allDataTypes = ['generation','so2','so2_not','nox','nox_not','co2','co2_not','heat','heat_not'];
        $dataOutput = [];
        if ($data_type === 'all') {

            foreach ($allDataTypes as $dataType) {

                if(in_array($dataType,$dataOutput)) continue;

                $dataOutput[$dataType] = $this->findDataType($dataType,$region,$numEdges);
            }
        } else {
            $dataOutput[$data_type] = $this->findDataType($data_type, $region, $numEdges);;
        }

        unset($region->id);
        unset($region->created_at);
        unset($region->updated_at);
        unset($run->id);
        unset($run->created_at);
        unset($run->updated_at);
        $regionalLoad->transform(function($item,$key) {
            unset($item->id);
            unset($item->run_id);
            unset($item->region_id);

            return $item;
        });
        $loadBinEdges->transform(function($item,$key) {
            unset($item->id);
            unset($item->run_id);
            unset($item->region_id);

            return $item;
        });

        return response()->json([
            'region' => $region,
            'run' => $run,
            'limits' => $limits,
            'regional_load' => $regionalLoad,
            'load_bin_edges' => $edgeArray,
//            'edge_count' => $numEdges,
            'data' => $dataOutput
        ]);
    }

    /**
     * @param $data_type
     * @param $region
     * @param $numEdges
     * @return mixed
     */
    public function findDataType($data_type, $region, $numEdges) {
        $data = Location::where('region_id', $region->id)->with(['medians' => function ($query) use ($data_type) {
            $query->where('median_type', $data_type);
        }])->get();

        $data->transform(function ($item, $key) use ($numEdges) {

//if($key === 1) {
//    printf((string)$item->medians);
//    printf(count($item->medians));
//    die();
//}

            $item->medians->transform(function ($median) {
                return $median['median'];
            });

            $item->medians = $item->medians->reject(function ($value, $key) use ($numEdges) {
                return $key > ($numEdges - 1);
            });

            unset($item->id);
            unset($item->region_id);
            unset($item->created_at);
            unset($item->updated_at);

//            return count($item->medians);

            return $item;
        });

        return $data;
    }
}
