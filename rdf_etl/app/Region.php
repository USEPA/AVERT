<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $table = 'regions';

    public function runs() {
        return $this->hasMany('App\Run','region_id');
    }

    public function loads() {
        return $this->hasMany('App\RegionalLoad','region_id');
    }

    public function edges() {
        return $this->hasMany('App\LoadBinEdge','region_id');
    }

    public function medians() {
        return $this->hasMany('App\LoadBinMedian','region_id');
    }

    public function locations() {
        return $this->hasMany('App\Location','region_id');
    }
}
