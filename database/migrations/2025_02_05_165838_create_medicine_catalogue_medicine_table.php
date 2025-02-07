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
        Schema::create('medicine_catalogue_medicine', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('medicine_catalogue_id');
            $table->unsignedBigInteger('medicine_id');
            $table->foreign('medicine_catalogue_id')->references('id')->on('medicine_catalogues')->onDelete('CASCADE');
            $table->foreign('medicine_id')->references('id')->on('medicines')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicine_catalogue_medicine');
    }
};
