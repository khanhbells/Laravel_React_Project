<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('modules', function (User $user, $permissionName) {
            if ($user->publish == 1) return false;
            $permission = $user->user_catalogues->permissions;
            if ($permission->contains('canonical', $permissionName)) {
                return true;
            }
            return false;
        });
    }
}
