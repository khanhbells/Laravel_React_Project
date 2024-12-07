<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Vu Bao Khanh',
            'email' => 'vubaokhanh@gmail.com',
            'password' => Hash::make('password'),
            'address' => 'To 8 phuong Dong Quang',
            'phone' => '0834225628'
        ]);
        // $this->call([
        //     UserSeeder::class
        // ]);
    }
}
