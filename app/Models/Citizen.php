<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Citizen extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\CitizenFactory> */
    use HasFactory, Notifiable;

    protected $table = 'citizens';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'is_anonymous',
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
            'is_anonymous' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get all complaints filed by this citizen.
     */
    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'citizen_id');
    }

    /**
     * Get all complaint updates for complaints filed by this citizen.
     */
    public function complaintUpdates()
    {
        return $this->hasManyThrough(
            ComplaintUpdate::class,
            Complaint::class,
            'citizen_id',
            'complaint_id'
        );
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
