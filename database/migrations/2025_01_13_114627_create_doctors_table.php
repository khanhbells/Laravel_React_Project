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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hospital_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('SET NULL');
            $table->foreign('hospital_id')->references('id')->on('hospitals')->onDelete('SET NULL');
            $table->string('canonical');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_keyword');
            $table->text('meta_description');
            $table->text('album')->nullable();
            $table->tinyInteger('publish');
            $table->tinyInteger('follow');
            $table->integer('order')->default(0);
            $table->string('exp', 100);
            $table->string('clinic_name', 100);
            $table->string('clinic_address', 100);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
