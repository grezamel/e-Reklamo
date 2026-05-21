<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    public function personnel(): HasMany
    {
        return $this->hasMany(Personnel::class);
    }
}
