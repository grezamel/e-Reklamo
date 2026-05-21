<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Personnel extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\PersonnelFactory> */
    use HasFactory, Notifiable;

    protected $table = 'personnel';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department_id',
        'position',
        'is_admin',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the department this personnel belongs to.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get all complaints assigned to this personnel.
     */
    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'assigned_to');
    }

    /**
     * Get all complaints assigned to this personnel (alias).
     */
    public function complaintsAssigned()
    {
        return $this->hasMany(Complaint::class, 'assigned_to');
    }

    /**
     * Update the model in the database.
     *
     * @param array $attributes
     * @param array $options
     * @return bool
     *
     * @phpstan-param array<string, mixed> $attributes
     * @phpstan-param array<string, mixed> $options
     */
    public function update(array $attributes = [], array $options = []): bool
    {
        return parent::update($attributes, $options);
    }
}
