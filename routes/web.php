<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Models\Reservation;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('/reservations', [ReservationController::class, 'userReservations'])->name('reservations.index');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');
    Route::get('/admin', [AdminController::class, 'index'])->name('admin');
    Route::get('/admin/reservations', [AdminController::class, 'reservations'])->name('admin.reservations');
    Route::post('/admin/reservations/{id}/approve', [AdminController::class, 'approve'])->name('admin.reservations.approve');
    Route::post('/admin/reservations/{id}/decline', [AdminController::class, 'decline'])->name('admin.reservations.decline');
    Route::delete('/admin/reservations/{id}', [AdminController::class, 'destroy'])->name('admin.reservations.destroy');
    Route::get('/admin/analytics', [\App\Http\Controllers\AdminController::class, 'analytics'])->name('admin.analytics');
    Route::get('/admin/users', [\App\Http\Controllers\UserManagementController::class, 'index'])->name('admin.users');
    Route::patch('/admin/users/{id}', [\App\Http\Controllers\UserManagementController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{id}', [\App\Http\Controllers\UserManagementController::class, 'destroy'])->name('admin.users.destroy');
    Route::post('/admin/users/{id}/promote', [\App\Http\Controllers\UserManagementController::class, 'promote'])->name('admin.users.promote');
    Route::middleware('auth')->get('/api/user/reservations', [DashboardController::class, 'userReservations']);
    Route::middleware('auth')->get('/api/user/notifications', [DashboardController::class, 'notifications']);
});

require __DIR__ . '/auth.php';
