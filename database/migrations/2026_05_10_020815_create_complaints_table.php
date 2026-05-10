<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique(); // e.g., REK-2026-001
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained();
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->string('location');
            $table->string('photo_path')->nullable();
            $table->string('status')->default('pending');
            $table->string('priority')->default('medium');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
