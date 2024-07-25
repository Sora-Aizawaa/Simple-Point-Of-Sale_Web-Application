<?php

use App\Http\Controllers\MasterData\DaftarItemController ;
use App\Http\Controllers\MasterData\KasirController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Auth/Register');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/daftar-item', [DaftarItemController::class, 'index'])->name('daftaritem.index');
    Route::post('/daftar-item', [DaftarItemController::class, 'store'])->name('daftaritem.store');

    // Route::get('/daftar-item/{id}', [DaftarItemController::class, 'update'])->name('daftaritem.update');
    Route::patch('/daftar-item/{id}', [DaftarItemController::class, 'update'])->name('daftaritem.update');
    Route::delete('/daftar-item/{id}', [DaftarItemController::class, 'destroy'])->name('daftaritem.destroy');



    Route::get('/kasir', [KasirController::class, 'index'])->name('kasir.index');

    
});

require __DIR__.'/auth.php';
