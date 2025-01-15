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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_catalogue_id')->default(1);
            $table->foreign('patient_catalogue_id')->references('id')->on('patient_catalogues')->onDelete('cascade');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 255)->nullable();
            $table->string('province_id', 10)->nullable();
            $table->string('district_id', 10)->nullable();
            $table->string('ward_id', 10)->nullable();
            $table->string('address')->nullable();
            $table->dateTime('birthday')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->tinyInteger('publish')->default(1);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('patient_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('patient_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('patient_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
        Schema::dropIfExists('patient_sessions');
    }
};
