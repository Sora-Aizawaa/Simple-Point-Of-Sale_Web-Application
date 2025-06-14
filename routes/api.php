<?php

use App\Http\Controllers\MasterData\KasirController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

    // Route::post('/generate-snap-token', [KasirController::class, 'generateSnapToken'])->name('generate.snap.token');
});

Route::post('/midtrans-callback', [KasirController::class, 'callback'])->name('midtrans.callback');
