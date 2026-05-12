<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    protected $fillable = [
        'reference_number',
        'user_id',
        'department_id',
        'category_id',
        'title',
        'description',
        'location',
        'status',
        'priority',
        'remarks',
    ];

    public function department() {
    return $this->belongsTo(Department::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
