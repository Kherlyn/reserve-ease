<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Reservation store request data:', $request->all());

        $validated = $request->validate([
            'package_id'                => 'nullable|exists:packages,id',
            'customer_full_name'        => 'nullable|string|max:255',
            'customer_address'          => 'nullable|string|max:1000',
            'customer_contact_number'   => 'nullable|string|regex:/^[0-9]{10,15}$/',
            'customer_email'            => 'nullable|email|max:255',
            'event_type'                => 'required|string|max:255',
            'event_date'                => 'required|date|after:today',
            'event_time'                => 'nullable|date_format:H:i',
            'venue'                     => 'required|string|max:255',
            'guest_count'               => 'required|integer|min:1',
            'customization'             => 'nullable|string',
            'total_amount'              => 'nullable|numeric|min:0',
            'selected_table_type'       => 'nullable|string',
            'selected_chair_type'       => 'nullable|string',
            'selected_foods'            => 'nullable|array',
            'selected_foods.*.name'     => 'nullable|string',
            'selected_foods.*.price'    => 'nullable|numeric|min:0',
            'customization_notes'       => 'nullable|string',
        ]);

        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        // Validate budget constraint if package and foods are selected
        if (!empty($validated['package_id']) && !empty($validated['selected_foods'])) {
            $package = \App\Models\Package::find($validated['package_id']);
            if ($package) {
                $totalFoodCost = collect($validated['selected_foods'])->sum('price');

                if ($totalFoodCost > $package->base_price) {
                    return back()->withErrors([
                        'selected_foods' => 'The total food cost exceeds the package price by ₱' . number_format($totalFoodCost - $package->base_price, 2)
                    ])->withInput();
                }
            }
        }

        // Create reservation
        $reservationData = [
            'user_id'                   => $user->id,
            'package_id'                => $validated['package_id'] ?? null,
            'customer_full_name'        => $validated['customer_full_name'] ?? $user->name,
            'customer_address'          => $validated['customer_address'] ?? null,
            'customer_contact_number'   => $validated['customer_contact_number'] ?? null,
            'customer_email'            => $validated['customer_email'] ?? $user->email,
            'event_type'                => $validated['event_type'],
            'event_date'                => $validated['event_date'],
            'event_time'                => $validated['event_time'] ?? null,
            'venue'                     => $validated['venue'],
            'guest_count'               => $validated['guest_count'],
            'customization'             => $validated['customization'] ?? null,
            'total_amount'              => $validated['total_amount'] ?? 0,
            'status'                    => 'pending',
            'payment_status'            => 'pending',
        ];

        $reservation = Reservation::create($reservationData);

        // Create associated PackageCustomization record if details are present
        if (!empty($validated['selected_table_type']) || !empty($validated['selected_chair_type']) || !empty($validated['selected_foods'])) {
            $reservation->customizationDetails()->create([
                'selected_table_type'   => $validated['selected_table_type'] ?? 'Default',
                'selected_chair_type'   => $validated['selected_chair_type'] ?? 'Default',
                'selected_foods'        => $validated['selected_foods'] ?? [],
                'customization_notes'   => $validated['customization_notes'] ?? null,
            ]);
        }

        return redirect()
            ->route('dashboard')
            ->with('success', 'Reservation submitted successfully!');
    }

    public function show(Reservation $reservation)
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        // Ensure user can only view their own reservations (unless admin)
        if ($reservation->user_id !== $user->id && !$user->is_admin) {
            abort(403, 'Unauthorized access to reservation');
        }

        // Eager load all required relationships
        $reservation->load([
            'package',
            'customizationDetails',
            'payments',
            'receipts'
        ]);

        return Inertia::render('Reservation/Show', [
            'reservation' => $reservation
        ]);
    }

    public function userReservations()
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        // Ensure only user's own reservations are returned with eager loaded relationships
        $reservations = Reservation::with([
            'package',
            'customizationDetails',
            'latestPayment',
            'payments',
            'receipts'
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Reservation/Index', ['reservations' => $reservations]);
    }
}
