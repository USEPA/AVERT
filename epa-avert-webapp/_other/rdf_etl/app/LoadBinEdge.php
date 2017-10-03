<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LoadBinEdge extends Model
{
    protected $table = 'load_bin_edges';

    protected $fillable = ['edge','edge_value_mw'];

    public $timestamps = false;

    public function run() {
        return $this->belongsTo('App\Run','run_id');
    }

    public function region() {
        return $this->belongsTo('App\Region','region_id');
    }

    public function median() {
        return $this->hasMany('App\LoadBinMedian','edge_id');
    }
}
