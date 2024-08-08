<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\DataPembeli;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataPembeliController extends Controller
{
    public function index()
    {
        $dataPembeli = DataPembeli::all();

        return Inertia::render('MasterData/DataPembeli', [
            'dataPembeli' => $dataPembeli
        ]);
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'nama' => 'required|string|max:255',
    //         'alamat' => 'required|string',
    //         'nomor_telepon' => 'required|string|max:15',
    //         'email' => 'required|string|email|max:255|unique:data_pembeli',
    //         'tanggal_pendaftaran' => 'required|date',
    //         'riwayat_pembelian' => 'nullable|array',
    //     ]);

    //     DataPembeli::create($request->all());

    //     return redirect()->route('data_pembeli.index')->with('success', 'Data pembeli berhasil ditambahkan.');
    // }

    // public function show($id)
    // {
    //     $dataPembeli = DataPembeli::findOrFail($id);
    //     return Inertia::render('DataPembeli/Show', [
    //         'dataPembeli' => $dataPembeli
    //     ]);
    // }

    // public function edit($id)
    // {
    //     $dataPembeli = DataPembeli::findOrFail($id);
    //     return Inertia::render('DataPembeli/Edit', [
    //         'dataPembeli' => $dataPembeli
    //     ]);
    // }

    // public function update(Request $request, $id)
    // {
    //     $request->validate([
    //         'nama' => 'required|string|max:255',
    //         'alamat' => 'required|string',
    //         'nomor_telepon' => 'required|string|max:15',
    //         'email' => 'required|string|email|max:255|unique:data_pembeli,email,' . $id . ',id_pembeli',
    //         'tanggal_pendaftaran' => 'required|date',
    //         'riwayat_pembelian' => 'nullable|array',
    //     ]);

    //     $dataPembeli = DataPembeli::findOrFail($id);
    //     $dataPembeli->update($request->all());

    //     return redirect()->route('data_pembeli.index')->with('success', 'Data pembeli berhasil diperbarui.');
    // }

    // public function destroy($id)
    // {
    //     $dataPembeli = DataPembeli::findOrFail($id);
    //     $dataPembeli->delete();

    //     return redirect()->route('data_pembeli.index')->with('success', 'Data pembeli berhasil dihapus.');
    // }
}
