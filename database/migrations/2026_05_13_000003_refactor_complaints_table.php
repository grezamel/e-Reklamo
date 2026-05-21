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
        // Drop existing table if it exists (from old migrations)
        Schema::dropIfExists('complaints');
        
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique(); // e.g., REK-20260513-001
            $table->foreignId('citizen_id')->constrained('citizens')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('personnel')->onDelete('set null'); // Personnel assigned to this complaint
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->json('photos')->nullable(); // Store multiple photo paths
            $table->enum('status', ['pending', 'acknowledged', 'in-progress', 'resolved', 'rejected'])->default('pending');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->text('remarks')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();
            
            $table->index('citizen_id');
            $table->index('assigned_to');
            $table->index('department_id');
            $table->index('status');
            $table->index('created_at');
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
