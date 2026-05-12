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
        Schema::table('complaints', function (Blueprint $table) {
            // Only add department_id if it doesn't exist
            if (!Schema::hasColumn('complaints', 'department_id')) {
                $table->foreignId('department_id')->after('user_id')->constrained();
            }

            // Only add category_id if it doesn't exist
            if (!Schema::hasColumn('complaints', 'category_id')) {
                $table->foreignId('category_id')->after('department_id')->constrained();
            }

            // Only drop 'category' if it still exists
            if (Schema::hasColumn('complaints', 'category')) {
                $table->dropColumn('category');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
