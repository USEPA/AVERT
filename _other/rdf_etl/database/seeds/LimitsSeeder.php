<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LimitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('limits')->insert([
             'region_id' => 1,
             'year' => 2015,
             'max_solar_wind_mwh' => 3980,
             'max_ee_yearly_gwh' => 34900,
             'max_ee_percent' => 15,
        ]);

        DB::table('limits')->insert([
             'region_id' => 2,
             'year' => 2015,
             'max_solar_wind_mwh' => 4780,
             'max_ee_yearly_gwh' => 41900,
             'max_ee_percent' => 15,
        ]);
    }
}
