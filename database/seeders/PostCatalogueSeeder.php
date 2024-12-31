<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class PostCatalogueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        foreach (range(1, 10) as $index) {
            DB::table('post_catalogues')->insert([
                'name' => $faker->word(),
                'canonical' => $faker->slug(),
                'description' => $faker->paragraph(),
                'content' => $faker->text(),
                'meta_title' => $faker->sentence(),
                'meta_keyword' => $faker->word(3, true),
                'meta_description' => $faker->sentence(),
                'parent_id' => 0,
                'lft' => 0,
                'rgt' => 0,
                'level' => 1,
                'image' => $faker->imageUrl(),
                'icon' => $faker->imageUrl(),
                'album' => $faker->text(),
                'publish' => 2,
                'follow' => 2,
                'order' => $faker->numberBetween(1, 10),
                'user_id' => 102,
                'deleted_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
