import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import CustomerInformationForm from "@/Components/CustomerInformationForm";
import PackageCustomization from "@/Components/PackageCustomization";
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";

export default function Book({ package: packageData }) {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        package_id: packageData.id,
        customer_full_name: "",
        customer_email: "",
        customer_contact_number: "",
        customer_address: "",
        selected_table_type: "",
        selected_chair_type: "",
        selected_foods: [],
        event_type: "",
        event_date: "",
        event_time: "",
        venue: "",
        guest_count: "",
        customization_notes: "",
        total_amount: packageData.base_price,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if budget is exceeded
        const totalFoodCost = data.selected_foods.reduce(
            (sum, food) => sum + parseFloat(food.price || 0),
            0
        );
        const basePrice = parseFloat(packageData.base_price || 0);

        if (totalFoodCost > basePrice) {
            alert(
                `Total food cost (₱${totalFoodCost.toFixed(
                    2
                )}) exceeds package budget (₱${basePrice.toFixed(2)})`
            );
            return;
        }

        console.log("Submitting reservation data:", data);

        post(route("reservations.store"), {
            onSuccess: () => {
                console.log("Reservation created successfully!");
                router.visit(route("reservations.index"));
            },
            onError: (errors) => {
                console.error(
                    "Reservation creation failed with errors:",
                    errors
                );

                // Display all validation errors
                const errorMessages = Object.entries(errors)
                    .map(([field, messages]) => `${field}: ${messages}`)
                    .join("\n");

                alert(`Failed to create reservation:\n\n${errorMessages}`);
            },
        });
    };

    const canProceedToStep2 = () => {
        return (
            data.customer_full_name &&
            data.customer_email &&
            data.customer_contact_number &&
            data.customer_address
        );
    };

    const canProceedToStep3 = () => {
        return (
            data.selected_table_type &&
            data.selected_chair_type &&
            data.selected_foods.length > 0
        );
    };

    const totalFoodCost = data.selected_foods.reduce(
        (sum, food) => sum + parseFloat(food.price || 0),
        0
    );
    const budgetExceeded =
        totalFoodCost > parseFloat(packageData.base_price || 0);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-bold leading-tight text-slate-800">
                        Book Your Event
                    </h2>
                    <p className="text-slate-600 mt-1">
                        Complete your booking for {packageData.name}
                    </p>
                </div>
            }
        >
            <Head title={`Book ${packageData.name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Progress Steps */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                        step >= 1
                                            ? "bg-amber-500 text-white"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    1
                                </div>
                                <span
                                    className={`font-medium ${
                                        step >= 1
                                            ? "text-slate-800"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Customer Info
                                </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                        step >= 2
                                            ? "bg-amber-500 text-white"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    2
                                </div>
                                <span
                                    className={`font-medium ${
                                        step >= 2
                                            ? "text-slate-800"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Customization
                                </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                        step >= 3
                                            ? "bg-amber-500 text-white"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    3
                                </div>
                                <span
                                    className={`font-medium ${
                                        step >= 3
                                            ? "text-slate-800"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Event Details
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                            {/* Step 1: Customer Information */}
                            {step === 1 && (
                                <CustomerInformationForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            )}

                            {/* Step 2: Package Customization */}
                            {step === 2 && (
                                <PackageCustomization
                                    packageData={packageData}
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            )}

                            {/* Step 3: Event Details */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                            Event Details
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-6">
                                            Provide details about your event
                                        </p>
                                    </div>

                                    {/* Event Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Event Type *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.event_type}
                                            onChange={(e) =>
                                                setData(
                                                    "event_type",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Wedding, Birthday, Corporate Event"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                            required
                                        />
                                        {errors.event_type && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.event_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Event Date *
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="date"
                                                    value={data.event_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "event_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    min={
                                                        new Date(
                                                            Date.now() +
                                                                86400000
                                                        )
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                    required
                                                />
                                            </div>
                                            {errors.event_date && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.event_date}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Event Time
                                            </label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="time"
                                                    value={data.event_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            "event_time",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                />
                                            </div>
                                            {errors.event_time && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.event_time}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Venue */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Venue *
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                value={data.venue}
                                                onChange={(e) =>
                                                    setData(
                                                        "venue",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter venue location"
                                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                required
                                            />
                                        </div>
                                        {errors.venue && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.venue}
                                            </p>
                                        )}
                                    </div>

                                    {/* Guest Count */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Number of Guests *
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="number"
                                                min="1"
                                                value={data.guest_count}
                                                onChange={(e) =>
                                                    setData(
                                                        "guest_count",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter number of guests"
                                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                required
                                            />
                                        </div>
                                        {errors.guest_count && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.guest_count}
                                            </p>
                                        )}
                                    </div>

                                    {/* Additional Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Additional Notes
                                        </label>
                                        <textarea
                                            value={data.customization_notes}
                                            onChange={(e) =>
                                                setData(
                                                    "customization_notes",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Any special requests or additional information..."
                                            rows={4}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
                                        />
                                        {errors.customization_notes && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.customization_notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                                <div>
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="flex items-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Back</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center space-x-3">
                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step + 1)}
                                            disabled={
                                                (step === 1 &&
                                                    !canProceedToStep2()) ||
                                                (step === 2 &&
                                                    (!canProceedToStep3() ||
                                                        budgetExceeded))
                                            }
                                            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>Continue</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing
                                                ? "Creating Reservation..."
                                                : "Complete Booking"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
