import { Fragment, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import {
    X,
    Calendar,
    Users,
    Clock,
    MapPin,
    Package,
    ChevronDown,
    Check,
    User as UserIcon,
} from "lucide-react";

const eventTypes = [
    { id: 1, name: "Wedding Reception", icon: "💒" },
    { id: 2, name: "Birthday Party", icon: "🎂" },
    { id: 3, name: "Anniversary", icon: "💕" },
    { id: 4, name: "Corporate Event", icon: "🏢" },
    { id: 5, name: "Baby Shower", icon: "👶" },
    { id: 6, name: "Graduation Party", icon: "🎓" },
    { id: 7, name: "Holiday Party", icon: "🎉" },
    { id: 8, name: "Other", icon: "🎊" },
];

const packages = [
    {
        id: 1,
        name: "Basic Package",
        price: 15000,
        description: "Perfect for small gatherings",
    },
    {
        id: 2,
        name: "Standard Package",
        price: 25000,
        description: "Great for medium events",
    },
    {
        id: 3,
        name: "Premium Package",
        price: 45000,
        description: "Full-service luxury experience",
    },
    {
        id: 4,
        name: "Custom Package",
        price: 0,
        description: "Tailored to your needs",
    },
];

const venues = [
    { id: 1, name: "Main Hall", capacity: "50-100 guests" },
    { id: 2, name: "Private Room", capacity: "10-30 guests" },
    { id: 3, name: "Garden Terrace", capacity: "20-50 guests" },
    { id: 4, name: "Rooftop Lounge", capacity: "30-80 guests" },
];

export default function CreateReservationModal({ isOpen, onClose }) {
    const [selectedEventType, setSelectedEventType] = useState(eventTypes[0]);
    const [selectedPackage, setSelectedPackage] = useState(packages[0]);
    const [selectedVenue, setSelectedVenue] = useState(venues[0]);

    const { data, setData, post, processing, errors, reset } = useForm({
        package_id: packages[0].id,
        event_type: eventTypes[0].name,
        event_date: "",
        event_time: "",
        venue: venues[0].name,
        guest_count: "",
        customization: "",
        total_amount: packages[0].price,
        customer_full_name: "",
        customer_address: "",
        customer_contact_number: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("reservations.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handlePackageChange = (pkg) => {
        setSelectedPackage(pkg);
        setData((data) => ({
            ...data,
            total_amount: pkg.price,
            package_id: pkg.name === "Custom Package" ? null : pkg.id,
        }));
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                                    <div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-bold text-slate-800"
                                        >
                                            Create New Reservation
                                        </Dialog.Title>
                                        <p className="text-slate-600 mt-1">
                                            Book your perfect event at Inwood
                                            Tavern
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            {/* Customer Details */}
                                            <div>
                                                <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                                    <Users className="w-5 h-5 mr-2 text-amber-600" />
                                                    Customer Details
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                            Full Name
                                                        </label>
                                                        <div className="relative">
                                                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="text"
                                                                value={data.customer_full_name}
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "customer_full_name",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Enter full name (optional)"
                                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                            />
                                                        </div>
                                                        {errors.customer_full_name && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {errors.customer_full_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                            Address *
                                                        </label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                            <textarea
                                                                value={data.customer_address}
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "customer_address",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Enter your full address"
                                                                rows={2}
                                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
                                                            />
                                                        </div>
                                                        {errors.customer_address && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {errors.customer_address}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                            Contact Number
                                                        </label>
                                                        <div className="relative">
                                                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="text"
                                                                value={data.customer_contact_number}
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "customer_contact_number",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Enter contact number"
                                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                            />
                                                        </div>
                                                        {errors.customer_contact_number && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {errors.customer_contact_number}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-200 pt-6"></div>

                                            {/* Event Type */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-3">
                                                    Event Type *
                                                </label>
                                                <Listbox
                                                    value={selectedEventType}
                                                    onChange={(value) => {
                                                        setSelectedEventType(
                                                            value
                                                        );
                                                        setData(
                                                            "event_type",
                                                            value.name
                                                        );
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-slate-200 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors">
                                                            <span className="flex items-center">
                                                                <span className="text-xl mr-3">
                                                                    {
                                                                        selectedEventType.icon
                                                                    }
                                                                </span>
                                                                <span className="block truncate font-medium">
                                                                    {
                                                                        selectedEventType.name
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                                <ChevronDown className="h-5 w-5 text-slate-400" />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Transition
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                                {eventTypes.map(
                                                                    (type) => (
                                                                        <Listbox.Option
                                                                            key={
                                                                                type.id
                                                                            }
                                                                            className={({
                                                                                active,
                                                                            }) =>
                                                                                `relative cursor-pointer select-none py-3 pl-4 pr-10 ${active
                                                                                    ? "bg-amber-50 text-amber-900"
                                                                                    : "text-slate-900"
                                                                                }`
                                                                            }
                                                                            value={
                                                                                type
                                                                            }
                                                                        >
                                                                            {({
                                                                                selected,
                                                                            }) => (
                                                                                <>
                                                                                    <div className="flex items-center">
                                                                                        <span className="text-xl mr-3">
                                                                                            {
                                                                                                type.icon
                                                                                            }
                                                                                        </span>
                                                                                        <span
                                                                                            className={`block truncate ${selected
                                                                                                ? "font-semibold"
                                                                                                : "font-normal"
                                                                                                }`}
                                                                                        >
                                                                                            {
                                                                                                type.name
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    {selected && (
                                                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-600">
                                                                                            <Check className="h-5 w-5" />
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    )
                                                                )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </Listbox>
                                                {errors.event_type && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.event_type}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Date and Time */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                        Event Date *
                                                    </label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="date"
                                                            value={
                                                                data.event_date
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "event_date",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                            min={
                                                                new Date(
                                                                    Date.now() +
                                                                    86400000
                                                                )
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            } // Tomorrow
                                                        />
                                                    </div>
                                                    {errors.event_date && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.event_date}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                        Event Time
                                                    </label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="time"
                                                            value={
                                                                data.event_time
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "event_time",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                        />
                                                    </div>
                                                    {errors.event_time && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.event_time}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Guest Count */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                    Number of Guests *
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="200"
                                                        value={data.guest_count}
                                                        onChange={(e) =>
                                                            setData(
                                                                "guest_count",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter number of guests"
                                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                    />
                                                </div>
                                                {errors.guest_count && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.guest_count}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Venue Selection */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-3">
                                                    Venue *
                                                </label>
                                                <Listbox
                                                    value={selectedVenue}
                                                    onChange={(value) => {
                                                        setSelectedVenue(value);
                                                        setData(
                                                            "venue",
                                                            value.name
                                                        );
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-slate-200 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors">
                                                            <span className="flex items-center">
                                                                <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                                                                <div>
                                                                    <span className="block font-medium">
                                                                        {
                                                                            selectedVenue.name
                                                                        }
                                                                    </span>
                                                                    <span className="block text-sm text-slate-500">
                                                                        {
                                                                            selectedVenue.capacity
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                                <ChevronDown className="h-5 w-5 text-slate-400" />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Transition
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                                {venues.map(
                                                                    (venue) => (
                                                                        <Listbox.Option
                                                                            key={
                                                                                venue.id
                                                                            }
                                                                            className={({
                                                                                active,
                                                                            }) =>
                                                                                `relative cursor-pointer select-none py-3 pl-4 pr-10 ${active
                                                                                    ? "bg-amber-50 text-amber-900"
                                                                                    : "text-slate-900"
                                                                                }`
                                                                            }
                                                                            value={
                                                                                venue
                                                                            }
                                                                        >
                                                                            {({
                                                                                selected,
                                                                            }) => (
                                                                                <>
                                                                                    <div className="flex items-center">
                                                                                        <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                                                                                        <div>
                                                                                            <span
                                                                                                className={`block ${selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal"
                                                                                                    }`}
                                                                                            >
                                                                                                {
                                                                                                    venue.name
                                                                                                }
                                                                                            </span>
                                                                                            <span className="block text-sm text-slate-500">
                                                                                                {
                                                                                                    venue.capacity
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {selected && (
                                                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-600">
                                                                                            <Check className="h-5 w-5" />
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    )
                                                                )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </Listbox>
                                                {errors.venue && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.venue}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            {/* Package Selection */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-3">
                                                    Package Selection
                                                </label>
                                                <div className="space-y-3">
                                                    {packages.map((pkg) => (
                                                        <div
                                                            key={pkg.id}
                                                            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedPackage.id ===
                                                                pkg.id
                                                                ? "border-amber-500 bg-amber-50"
                                                                : "border-slate-200 hover:border-amber-300"
                                                                }`}
                                                            onClick={() =>
                                                                handlePackageChange(
                                                                    pkg
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <Package className="w-5 h-5 text-amber-600" />
                                                                    <div>
                                                                        <h4 className="font-semibold text-slate-800">
                                                                            {
                                                                                pkg.name
                                                                            }
                                                                        </h4>
                                                                        <p className="text-sm text-slate-600">
                                                                            {
                                                                                pkg.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-lg font-bold text-slate-800">
                                                                        {pkg.price >
                                                                            0
                                                                            ? `₱${Number(pkg.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                                                                            : "Custom"}
                                                                    </p>
                                                                    {selectedPackage.id ===
                                                                        pkg.id && (
                                                                            <Check className="w-5 h-5 text-amber-600 ml-auto mt-1" />
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {errors.total_amount && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.total_amount}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Total Amount Display */}
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-700 font-medium">
                                                        Estimated Total:
                                                    </span>
                                                    <span className="text-2xl font-bold text-amber-700">
                                                        {data.total_amount > 0
                                                            ? `₱${Number(
                                                                data.total_amount
                                                            ).toLocaleString(
                                                                "en-PH",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}`
                                                            : "Custom Quote"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    Final pricing may vary based
                                                    on customizations
                                                </p>
                                            </div>

                                            {/* Customization/Special Requests */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                    Special Requests &
                                                    Customizations
                                                </label>
                                                <textarea
                                                    value={data.customization}
                                                    onChange={(e) =>
                                                        setData(
                                                            "customization",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Tell us about any special requirements, dietary restrictions, decorations, entertainment, or other customizations for your event..."
                                                    rows={6}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
                                                />
                                                {errors.customization && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.customization}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                                        <div className="text-sm text-slate-600">
                                            <p>
                                                Your reservation will be
                                                reviewed within 24 hours
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                * Required fields
                                            </p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        <span>Creating...</span>
                                                    </>
                                                ) : (
                                                    <span>
                                                        Create Reservation
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child >
                    </div >
                </div >
            </Dialog >
        </Transition >
    );
}
