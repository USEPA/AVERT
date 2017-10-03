<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('load','ExtractionController@showExtraction');

Route::group(['prefix'=>'api/v1'],function(){
    Route::get('region','RegionController@listRegions');
    Route::get('region/{name}','RegionController@getRuns');
    Route::get('region/{name}/year/{year}','RegionController@getYear');
    Route::get('region/{name}/year/{year}/data/{data_type}','RegionController@getData');
    Route::get('region/{name}/year/{year}/export/{data_type}','RegionController@exportData');
});
