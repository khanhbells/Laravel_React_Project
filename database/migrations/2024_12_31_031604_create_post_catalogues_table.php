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
        Schema::create('post_catalogues', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('canonical');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('meta_title');
            $table->string('meta_keyword');
            $table->text('meta_description');
            $table->integer('parent_id');
            $table->integer('lft');
            $table->integer('rgt');
            $table->integer('level');
            $table->string('image')->nullable();
            $table->string('icon')->nullable();
            $table->text('album')->nullable();
            $table->tinyInteger('publish');
            $table->tinyInteger('follow');
            $table->integer('order');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('SET NULL');
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_catalogues');
    }
};