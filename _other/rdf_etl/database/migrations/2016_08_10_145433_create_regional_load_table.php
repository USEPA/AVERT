<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRegionalLoadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('regional_load', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('run_id');
            $table->integer('region_id');
            $table->smallInteger('hour_of_year');
            $table->smallInteger('year');
            $table->smallInteger('month');
            $table->smallInteger('day');
            $table->smallInteger('hour');
            $table->integer('regional_load_mw');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('regional_load');
    }
}
