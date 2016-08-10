<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';

    protected $fillable = ['state','county','lat','lon','fuel_type','orispl_code','unit_code','full_name'];

    public function region() {
        return $this->belongsTo('App\Region','region_id');
    }
}
