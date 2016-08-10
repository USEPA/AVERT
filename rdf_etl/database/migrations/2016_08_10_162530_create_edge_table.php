<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEdgeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('load_bin_edges', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('run_id');
            $table->integer('region_id');
            $table->integer('edge');
            $table->integer('edge_value_mw');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('load_bin_edges');
    }
}
