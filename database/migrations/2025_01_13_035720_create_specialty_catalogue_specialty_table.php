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
        Schema::create('specialty_catalogue_specialty', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('specialty_catalogue_id');
            $table->unsignedBigInteger('specialty_id');
            $table->foreign('specialty_catalogue_id')->references('id')->on('specialty_catalogues')->onDelete('CASCADE');
            $table->foreign('specialty_id')->references('id')->on('specialties')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specialty_catalogue_specialty');
    }
};
