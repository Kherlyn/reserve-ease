<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    // Only allow access if user is 'admin'
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }
        $users = User::all(); 
        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    // Update user info
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }
        $target = User::findOrFail($id);
        $target->update($request->only(['username', 'email', 'role']));
        return redirect()->back();
    }

    // Delete user
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }
        $target = User::findOrFail($id);
        $target->delete();
        return redirect()->back();
    }

    // Promote user to admin
    public function promote(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }
        $target = User::findOrFail($id);
        $target->role = 'admin';
        $target->save();
        return redirect()->back();
    }
}
