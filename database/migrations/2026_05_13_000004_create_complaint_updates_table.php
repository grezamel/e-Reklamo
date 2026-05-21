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
        Schema::create('complaint_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->onDelete('cascade');
            $table->foreignId('personnel_id')->nullable()->constrained('personnel')->onDelete('set null');
            $table->enum('status', ['pending', 'acknowledged', 'in-progress', 'resolved', 'rejected']);
            $table->text('remarks')->nullable();
            $table->string('updated_by_name')->nullable(); // Store the name in case personnel is deleted
            $table->timestamps();
            
            $table->index('complaint_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint_updates');
    }
};
