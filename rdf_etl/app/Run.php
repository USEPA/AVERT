<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Run extends Model
{
    protected $table = 'runs';

    public function region() {
        return $this->belongsTo('App\Region','region_id');
    }

    public function loads() {
        return $this->hasMany('App\RegionalLoad','run_id');
    }

    public function edges() {
        return $this->hasMany('App\LoadBinEdge','run_id');
    }
}
