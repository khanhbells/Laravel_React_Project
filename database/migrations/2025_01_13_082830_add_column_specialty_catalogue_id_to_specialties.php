<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('specialties', function (Blueprint $table) {
            $table->unsignedBigInteger('specialty_catalogue_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('specialties', function (Blueprint $table) {
            $table->dropColumn('specialty_catalogue_id');
        });
    }
};
