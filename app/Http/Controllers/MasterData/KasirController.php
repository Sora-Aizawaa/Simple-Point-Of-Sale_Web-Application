<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KasirController extends Controller
{
    public function index(){
        return Inertia::render('MasterData/Kasir');
    }
}
