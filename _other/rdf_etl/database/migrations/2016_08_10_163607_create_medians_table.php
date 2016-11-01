<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMediansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('load_bin_medians', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('run_id');
            $table->integer('region_id');
            $table->integer('location_id');
            $table->string('state');
            $table->string('fuel_type');
            $table->integer('edge_id');
            $table->integer('edge_value_mw');
            $table->enum('median_type',['generation','so2','so2_not','nox','nox_not','co2','co2_not','heat','heat_not']);
            $table->float('median');
            $table->string('median_unit');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('load_bin_medians');
    }
}
