<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RegionalLoad extends Model
{
    protected $table = 'regional_load';

    protected $fillable = ['hour_of_year','year','month','day','hour','regional_load_mw','hourly_limit'];

    public $timestamps = false;

    public function run() {
        return $this->belongsTo('App\Run','run_id');
    }

    public function region() {
        return $this->belongsTo('App\Region','region_id');
    }
}
