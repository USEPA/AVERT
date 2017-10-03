<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Limit extends Model
{
    protected $table = 'limits';

    protected $fillable = ['max_solar_wind_mwh','max_ee_yearly_gwh','max_ee_percent'];

    public function region() {
        return $this->belongsTo('App\Region','region_id');
    }
}
