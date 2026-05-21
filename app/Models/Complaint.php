<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Complaint extends Model
{
    protected $fillable = [
        'reference_number',
        'citizen_id',
        'assigned_to',
        'department_id',
        'category_id',
        'title',
        'description',
        'location',
        'photos',
        'status',
        'priority',
        'remarks',
        'is_anonymous',
        'resolved_at',
        'acknowledged_at',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_anonymous' => 'boolean',
        'resolved_at' => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class);
    }

    public function assignedPersonnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'assigned_to');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ComplaintUpdate::class);
    }

    /**
     * Get the complainant name, handling anonymous complaints.
     */
    public function getComplainantNameAttribute()
    {
        if ($this->is_anonymous) {
            return 'Anonymous Citizen';
        }
        return $this->citizen?->name ?? 'Unknown Citizen';
    }

    /**
     * Update the model in the database.
     *
     * @param array $attributes
     * @param array $options
     * @return bool
     */
    public function update(array $attributes = [], array $options = []): bool
    {
        return parent::update($attributes, $options);
    }
}
