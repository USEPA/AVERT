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
}
