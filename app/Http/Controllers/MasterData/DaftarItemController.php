<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class DaftarItemController extends Controller
{
    public function index()
    {
        return Inertia::render('MasterData/DaftarItem', [
            'items' => Item::get()
        ]);
    }

    
    public function store(Request $request)
    {

        $request->validate([
            'kode_item' => 'required',
            'nama_item' => 'required',
            'stok' => 'required',
            'satuan' => 'required',
            'jenis' => 'required',
            'merk' => 'required',
            'harga' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        $imageName = time() . '.' . $request->image->extension();
        $request->image->move(public_path('images'), $imageName);
    
        Item::create([
            'kode_item' => $request->kode_item,
            'nama_item' => $request->nama_item,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
            'jenis' => $request->jenis,
            'merk' => $request->merk,
            'harga' => $request->harga,
            'image' => '/images/' . $imageName,
        ]);
    
        return inertia('MasterData/DaftarItem', [
            'items' => Item::get(), 
        ]);
    
    }

        public function update(Request $request, $id)
    {
        // // Validate the request data
        // $request->validate([
        //     'kode_item' => 'required',
        //     'nama_item' => 'required',
        //     'stok' => 'required',
        //     'satuan' => 'required',
        //     'jenis' => 'required',
        //     'merk' => 'required',
        //     'harga' => 'required',
        //     'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        // ]);

        // // Find the item by id
        // $item = Item::findOrFail($id);

        // // Update the item data
        // $item->kode_item = $request->input('kode_item');
        // $item->nama_item = $request->input('nama_item');
        // $item->stok = $request->input('stok');
        // $item->satuan = $request->input('satuan');
        // $item->jenis = $request->input('jenis');
        // $item->merk = $request->input('merk');
        // $item->harga = $request->input('harga');

        // // Handle image upload if present
        // // if ($request->hasFile('image')) {
        // //     $imagePath = $request->file('image')->store('images', 'public');
        // //     $item->image = $imagePath;
        // // }

        // if ($request->hasFile('image')) {
        //     // Hapus gambar lama jika ada
        //     if ($item->image) {
        //         Storage::delete('public/' . $item->image);
        //     }
        
        //     // Ambil nama asli file yang diunggah
        //     $originalFileName = $request->file('image')->getClientOriginalName();
        
        //     // Simpan file gambar ke penyimpanan dengan nama baru
        //     $imagePath = $request->file('image')->storeAs('public/images', $originalFileName);
        
        //     // Perbarui path gambar pada item
        //     $item->image = str_replace('public/', '', $imagePath); // Hapus 'public/' agar sesuai dengan path yang tersimpan di database
        // }

        // // Save the updated item
        // $item->save();

        // // Redirect back with a success message
        // return redirect()->route('daftaritem.index')->with('success', 'Item updated successfully');
        
        Log::info('Masuk ke fungsi update');

        $request->validate([
            'kode_item' => 'required',
            'nama_item' => 'required',
            'stok' => 'required',
            'satuan' => 'required',
            'jenis' => 'required',
            'merk' => 'required',
            'harga' => 'required',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        Log::info('Validasi berhasil');

        $item = Item::findOrFail($id);

        Log::info('Item ditemukan', ['item' => $item]);
    
        $item->kode_item = $request->input('kode_item');
        $item->nama_item = $request->input('nama_item');
        $item->stok = $request->input('stok');
        $item->satuan = $request->input('satuan');
        $item->jenis = $request->input('jenis');
        $item->merk = $request->input('merk');
        $item->harga = $request->input('harga');
    
        
        if ($request->hasFile('image')) {
            Log::info('Ada file gambar baru');

        // Hapus gambar lama jika ada
        if ($item->image) {
            Storage::delete('public/' . $item->image);
            Log::info('Gambar lama dihapus', ['image' => $item->image]);
        }

        // Simpan gambar baru
        $originalFileName = time() . '_' . $request->file('image')->getClientOriginalName();
        $request->file('image')->move(public_path('images'), $originalFileName);
        $item->image = 'images/' . $originalFileName;

        Log::info('Gambar baru disimpan', ['image' => $item->image]);
    }

        $item->save();
        Log::info('Item berhasil disimpan', ['item' => $item]);
    
        // Buat respons Inertia dengan data yang diperlukan
        return Inertia::location(route('daftaritem.index'));
    
    
    }


    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete();

        return redirect()->route('daftaritem.index');
    }
}
