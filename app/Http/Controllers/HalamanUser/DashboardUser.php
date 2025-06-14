<?php

namespace App\Http\Controllers\HalamanUser;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class DashboardUser extends Controller
{
    public function index()
    {
        return Inertia::render('HalamanUser/DashboardUser', [
            // 'items' => Item::get()
        ]);
    }
}
