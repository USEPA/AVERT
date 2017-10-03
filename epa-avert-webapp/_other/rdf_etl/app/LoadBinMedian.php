<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LoadBinMedian extends Model
{
    protected $table = 'load_bin_medians';
    
    protected $fillable = ['state','fuel_type','edge_id','edge_value_mw','median_type','median','median_unit'];

    public $timestamps = false;

    public function run() {
        return $this->belongsTo('App\Run','run_id');
    }

    public function region() {
        return $this->belongsTo('App\Region','region_id');
    }

    public function edge() {
        return $this->belongsTo('App\LoadBinEdge','edge_id');
    }

    public function location() {
        return $this->belongsTo('App\Location','location_id');
    }
}